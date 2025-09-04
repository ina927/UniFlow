import clsx from 'clsx';

interface Props<T> {
  className?: string;
  options: T[];
  selectedOption: string;
  setSelectedOption: (optionId: string) => void;
}

export const Seletor = <T extends { id: string; title: string }>(props: Props<T>) => {
  const { options, selectedOption, setSelectedOption } = props;
  
  return (
    <select 
      onChange={(e) => setSelectedOption(e.target.value)} 
      value={selectedOption} 
      className={clsx("p-2 border rounded", props.className)}
    >
      {options
        .map((option: T) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
    </select>
  );
};
