from __future__ import annotations

from typing import Iterable


def join_texts(texts: Iterable[str]) -> str:
    return " ".join(t for t in texts if t).strip()
