interface NoteFieldProps {
  value: string;
}

export const NoteField = ({ value }: NoteFieldProps) => (
  <textarea
    value={value}
    readOnly
    rows={3}
    className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none"
  />
);
