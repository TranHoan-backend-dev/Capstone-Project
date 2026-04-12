from __future__ import annotations

import argparse
import json
import random
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset


CLASSES = [str(i) for i in range(10)]
CLASS_TO_INDEX = {label: index for index, label in enumerate(CLASSES)}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train a 0-9 digit classifier from a generated digit dataset."
    )
    parser.add_argument(
        "--dataset-dir",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\digit_dataset"),
    )
    parser.add_argument(
        "--output-path",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\models\reading_digit_classifier.pt"),
    )
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--learning-rate", type=float, default=1e-3)
    parser.add_argument("--image-size", type=int, default=32)
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()


def seed_everything(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


def list_samples(split_dir: Path) -> list[tuple[Path, int]]:
    samples: list[tuple[Path, int]] = []
    for label in CLASSES:
        class_dir = split_dir / label
        if not class_dir.exists():
            continue
        for path in sorted(class_dir.glob("*.png")):
            samples.append((path, CLASS_TO_INDEX[label]))
    return samples


def compute_class_weights(samples: list[tuple[Path, int]]) -> torch.Tensor:
    counts = np.zeros(len(CLASSES), dtype=np.float32)
    for _, class_index in samples:
        counts[class_index] += 1.0

    counts = np.maximum(counts, 1.0)
    weights = counts.sum() / counts
    weights = weights / weights.mean()
    return torch.tensor(weights, dtype=torch.float32)


def augment_image(image: np.ndarray) -> np.ndarray:
    image = image.copy()
    h, w = image.shape[:2]

    dx = random.randint(-2, 2)
    dy = random.randint(-2, 2)
    matrix = np.float32([[1, 0, dx], [0, 1, dy]])
    image = cv2.warpAffine(image, matrix, (w, h), borderValue=255)

    if random.random() < 0.3:
        alpha = random.uniform(0.9, 1.1)
        beta = random.uniform(-10, 10)
        image = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)

    if random.random() < 0.2:
        image = cv2.GaussianBlur(image, (3, 3), 0)

    return image


class DigitDataset(Dataset):
    def __init__(self, samples: list[tuple[Path, int]], image_size: int = 32, train: bool = False):
        self.samples = samples
        self.image_size = image_size
        self.train = train

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        path, label = self.samples[index]
        image = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
        if image is None:
            image = np.full((self.image_size, self.image_size), 255, dtype=np.uint8)
        else:
            image = cv2.resize(image, (self.image_size, self.image_size), interpolation=cv2.INTER_CUBIC)

        if self.train:
            image = augment_image(image)

        image = image.astype(np.float32) / 255.0
        image = (image - 0.5) / 0.5
        tensor = torch.from_numpy(image).unsqueeze(0)
        target = torch.tensor(label, dtype=torch.long)
        return tensor, target


class DigitClassifier(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((1, 1)),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.2),
            nn.Linear(64, 10),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        return self.classifier(x)


@dataclass
class EvalResult:
    loss: float
    accuracy: float


def evaluate(model: nn.Module, loader: DataLoader, criterion: nn.Module, device: torch.device) -> EvalResult:
    model.eval()
    total_loss = 0.0
    total_correct = 0
    total_count = 0

    with torch.no_grad():
        for images, targets in loader:
            images = images.to(device)
            targets = targets.to(device)

            logits = model(images)
            loss = criterion(logits, targets)

            total_loss += loss.item() * targets.size(0)
            predictions = logits.argmax(dim=1)
            total_correct += (predictions == targets).sum().item()
            total_count += targets.size(0)

    if total_count == 0:
        return EvalResult(loss=0.0, accuracy=0.0)

    return EvalResult(
        loss=total_loss / total_count,
        accuracy=total_correct / total_count,
    )


def train(args: argparse.Namespace) -> None:
    seed_everything(args.seed)

    train_samples = list_samples(args.dataset_dir / "train")
    val_samples = list_samples(args.dataset_dir / "val")
    test_samples = list_samples(args.dataset_dir / "test")

    if not train_samples:
        raise RuntimeError(f"No training samples found in {args.dataset_dir / 'train'}")

    train_dataset = DigitDataset(train_samples, image_size=args.image_size, train=True)
    val_dataset = DigitDataset(val_samples, image_size=args.image_size, train=False)
    test_dataset = DigitDataset(test_samples, image_size=args.image_size, train=False)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size, shuffle=False, num_workers=0)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = DigitClassifier().to(device)
    class_weights = compute_class_weights(train_samples).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate)

    best_val_acc = -1.0
    history: list[dict[str, float | int]] = []
    args.output_path.parent.mkdir(parents=True, exist_ok=True)

    for epoch in range(1, args.epochs + 1):
        model.train()
        running_loss = 0.0
        seen = 0

        for images, targets in train_loader:
            images = images.to(device)
            targets = targets.to(device)

            optimizer.zero_grad(set_to_none=True)
            logits = model(images)
            loss = criterion(logits, targets)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * targets.size(0)
            seen += targets.size(0)

        train_loss = running_loss / max(seen, 1)
        val_result = evaluate(model, val_loader, criterion, device)

        history.append(
            {
                "epoch": epoch,
                "train_loss": train_loss,
                "val_loss": val_result.loss,
                "val_accuracy": val_result.accuracy,
            }
        )

        print(
            f"epoch={epoch} "
            f"train_loss={train_loss:.4f} "
            f"val_loss={val_result.loss:.4f} "
            f"val_acc={val_result.accuracy:.4f}"
        )

        if val_result.accuracy > best_val_acc:
            best_val_acc = val_result.accuracy
            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "classes": CLASSES,
                    "image_size": args.image_size,
                    "best_val_accuracy": best_val_acc,
                },
                args.output_path,
            )

    checkpoint = torch.load(args.output_path, map_location=device)
    model.load_state_dict(checkpoint["model_state_dict"])

    test_result = evaluate(model, test_loader, criterion, device)
    summary = {
        "dataset_dir": str(args.dataset_dir),
        "output_path": str(args.output_path),
        "device": str(device),
        "train_samples": len(train_samples),
        "val_samples": len(val_samples),
        "test_samples": len(test_samples),
        "class_weights": {label: round(float(class_weights[index].item()), 4) for index, label in enumerate(CLASSES)},
        "best_val_accuracy": best_val_acc,
        "test_accuracy": test_result.accuracy,
        "test_loss": test_result.loss,
        "history": history,
    }

    summary_path = args.output_path.with_suffix(".json")
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    print(json.dumps(summary, indent=2))
    print(f"model   -> {args.output_path}")
    print(f"summary -> {summary_path}")


def main() -> None:
    args = parse_args()
    train(args)


if __name__ == "__main__":
    main()
