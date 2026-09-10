"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteTermButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Bu terimi silmek istediğinize emin misiniz?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/glossary/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    } catch (error) {
      alert('Bağlantı hatası.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-text-secondary hover:text-accent-red hover:bg-accent-red/10 rounded transition-colors disabled:opacity-50"
      title="Sil"
    >
      <Trash2 size={18} />
    </button>
  );
}
