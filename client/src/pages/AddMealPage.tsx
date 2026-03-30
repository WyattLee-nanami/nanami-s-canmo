import MealForm from '../components/MealForm';

interface AddMealPageProps {
  onSuccess: () => void;
}

export default function AddMealPage({ onSuccess }: AddMealPageProps) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">记录饮食</h1>
      <MealForm onSuccess={onSuccess} />
    </div>
  );
}
