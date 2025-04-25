'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Specification {
  key: string;
  value: string;
}

interface SpecificationManagerProps {
  specifications: Specification[];
  onChange: (specifications: Specification[]) => void;
}

export default function SpecificationManager({ specifications, onChange }: SpecificationManagerProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newKey && newValue) {
      onChange([...specifications, { key: newKey, value: newValue }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Спецификации</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {specifications.map((spec, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="text"
              value={spec.key}
              onChange={(e) => {
                const newSpecs = [...specifications];
                newSpecs[index].key = e.target.value;
                onChange(newSpecs);
              }}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
              placeholder="Название характеристики"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => {
                const newSpecs = [...specifications];
                newSpecs[index].value = e.target.value;
                onChange(newSpecs);
              }}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
              placeholder="Значение"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
          placeholder="Название характеристики"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
          placeholder="Значение"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="p-2 text-olive hover:text-olive/80"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 