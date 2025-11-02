import { DistractionButton } from "../DistractionButton";

export default function DistractionButtonExample() {
  return (
    <div className="relative h-64 flex items-center justify-center">
      <DistractionButton count={3} onClick={() => console.log('Distracted!')} />
    </div>
  );
}
