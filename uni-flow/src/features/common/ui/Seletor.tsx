import clsx from 'clsx';

interface Props<T> {
  className?: string;
  options: T[];
  selectedOption: T;
  setSelectedOption: (option: T) => void;
}

export const Seletor = <T extends { id: string; option: string }>(props: Props<T>) => {
  const { options, selectedOption, setSelectedOption } = props;

  return (
    <select 
      onChange={(e) => setSelectedOption(options.find((option: T) => option.id === e.target.value) as T)} 
      value={selectedOption.id}
      className={clsx("p-2 border rounded", props.className)}
    >
      {options
        .map((option: T) => (
          <option key={option.id} value={option.id}>
            {option.option}
          </option>
        ))}
    </select>
  );
};
