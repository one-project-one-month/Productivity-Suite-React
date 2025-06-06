import { getAllCategoryNotes } from '@/api/notes';
import CategoryFolderCard from '@/app/features/notes/components/CategoryFolderCard';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Folder, Plus } from 'lucide-react';

export default function MarkdownEditor() {
  const { data, isLoading } = useQuery({
    queryKey: ['note-categories'],
    queryFn: async (): Promise<NoteCategory[]> =>
      await getAllCategoryNotes().then((res) => {
        if (res.data.code === 200) {
          return res.data.data;
        }
        throw new Error('Failed to fetch note categories');
      }),
  });

  const skeletons = new Array(6).fill(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100dvh-220px)]">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {skeletons.map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-lg h-32 w-full"
            />
          ))}
        </div>
      ) : (data ?? []).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {data?.map((category) => (
            <CategoryFolderCard key={category.categoryId} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No categories found</p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create your first category
          </Button>
        </div>
      )}
    </div>
  );
}
