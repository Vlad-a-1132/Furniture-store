'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ColorVariant } from '@/types';
import Image from 'next/image';

interface ColorManagerProps {
  initialColors?: ColorVariant[];
  onChange: (colors: ColorVariant[]) => void;
}

export default function ColorManager({ initialColors = [], onChange }: ColorManagerProps) {
  const [colors, setColors] = useState<ColorVariant[]>(initialColors);
  const [newColor, setNewColor] = useState<Partial<ColorVariant>>({ 
    name: '', 
    hex: '#000000', 
    image: '' 
  });

  const handleAddColor = () => {
    if (newColor.name && newColor.hex && newColor.image) {
      const updatedColors = [...colors, { ...newColor as ColorVariant }];
      setColors(updatedColors);
      onChange(updatedColors);
      setNewColor({ name: '', hex: '#000000', image: '' });
    }
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
    onChange(updatedColors);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        setNewColor({ ...newColor, image: data.urls[0] });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Цветовые варианты</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="relative w-24 h-24">
              <Image
                src={color.image}
                alt={color.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{color.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-gray-600">{color.hex}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveColor(index)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название цвета
          </label>
          <input
            type="text"
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
            placeholder="Например: Бежевый"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            HEX код цвета
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={newColor.hex}
              onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
              className="h-[42px] w-[42px] p-1 rounded border"
            />
            <input
              type="text"
              value={newColor.hex}
              onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/30"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Изображение цвета
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-olive/10 file:text-olive
              hover:file:bg-olive/20"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddColor}
        disabled={!newColor.name || !newColor.hex || !newColor.image}
        className="w-full px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Добавить цветовой вариант
      </button>
    </div>
  );
} 