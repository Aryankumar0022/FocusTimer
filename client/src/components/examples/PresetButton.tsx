import { PresetButton } from "../PresetButton";

export default function PresetButtonExample() {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-md p-8">
      <PresetButton duration={25} label="min" isActive={true} onClick={() => console.log('25 min clicked')} />
      <PresetButton duration={50} label="min" isActive={false} onClick={() => console.log('50 min clicked')} />
      <PresetButton duration={90} label="min" isActive={false} onClick={() => console.log('90 min clicked')} />
    </div>
  );
}
