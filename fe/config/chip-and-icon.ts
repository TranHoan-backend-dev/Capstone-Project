import {
  BanknotesIcon,
  ChartBarIcon,
  ArrowPathRoundedSquareIcon,
  ClockIcon,
  PrinterIcon,
  CalculatorIcon,
  PencilSquareIcon,
  ClipboardDocumentListIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  FolderIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export const DarkGreenChip = "dark:bg-green-900 dark:text-white";
export const DarkBlueChip = "dark:bg-blue-900 dark:text-white";
export const DarkYellowChip = "dark:bg-amber-200 dark:text-zinc-900";
export const DarkRedChip = "dark:bg-red-900 dark:text-white";
export const DarkWhiteChip = "dark:bg-white dark:text-black";
export const DarkGrayChip = "dark:bg-gray-900 dark:text-white";
export const DarkPurpleChip = "dark:bg-purple-900 dark:text-white";

export const ProfileIcon = FolderIcon;
export const SetPriceIcon = BanknotesIcon; // áp giá
export const UsageIcon = ChartBarIcon; // tiêu thụ
export const ReplaceWaterMeter = ArrowPathRoundedSquareIcon; // thay đồng hồ
export const HistoryIcon = ClockIcon;
export const PrintReceiptIcon = PrinterIcon; // in biên nhận
export const DeleteIcon = TrashIcon;
export const SettlementIcon = CalculatorIcon; // quyết toán
export const EditIcon = PencilSquareIcon;
export const ApprovalIcon = CheckCircleIcon; // duyệt
export const RejectIcon = XCircleIcon; // từ chối
export const RestoreIcon = ArrowPathIcon;
export const EstimationIcon = ClipboardDocumentListIcon; // dự toán
export const ViewIcon = EyeIcon;
export const LoadingMaterialsIcon = ClipboardDocumentListIcon; // bốc vật tư
export const SearchIcon = MagnifyingGlassIcon;
export const AddNewIcon = DocumentPlusIcon;

const BaseColor = "w-5 h-5 cursor-pointer transition-colors";

export const RedIconColor = `${BaseColor} text-red-500 dark:text-danger hover:text-red-600 dark:hover:text-danger-400`;
export const BlueYellowIconColor = `${BaseColor} text-blue-500 dark:text-yellow-400 hover:text-blue-700 dark:hover:text-primary-600`;
export const GreenIconColor = `${BaseColor} text-green-500 dark:text-success hover:text-green-600`;
export const AmberIconColor = `${BaseColor} text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300`;
export const WhiteIconColor = `${BaseColor} text-white-500 dark:text-white-400 hover:text-white-600 dark:hover:text-white-300`;

export const TitleDarkColor = "dark:text-yellow-300";
