import { Input } from "@/components/ui/input";

interface TransactionFormFieldsProps {
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

export function TransactionFormFields({
  description,
  setDescription,
  amount,
  setAmount,
  category,
  setCategory,
}: TransactionFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
        />
      </div>
    </>
  );
}