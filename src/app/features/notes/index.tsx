import CategoryFolderCard from '@/app/features/notes/components/CategoryFolderCard';
import { Button } from '@/components/ui/button';
import { Folder, Plus } from 'lucide-react';

const demoCategories: Category[] = [
  {
    categoryId: 1,
    categoryName: 'Work',
    color: '#FF5733',
    numberOfNotes: 12,
  },
  {
    categoryId: 2,
    categoryName: 'Personal',
    color: '#33B5FF',
    numberOfNotes: 7,
  },
  {
    categoryId: 2,
    categoryName: 'Personal',
    color: '#33B5FF',
    numberOfNotes: 7,
  },
  {
    categoryId: 2,
    categoryName: 'Personal',
    color: '#33B5FF',
    numberOfNotes: 7,
  },
  {
    categoryId: 2,
    categoryName: 'Personal',
    color: '#33B5FF',
    numberOfNotes: 7,
  },
  {
    categoryId: 2,
    categoryName: 'Personal',
    color: '#33B5FF',
    numberOfNotes: 7,
  },
  {
    categoryId: 2,
    categoryName: 'Personal',
    color: '#33B5FF',
    numberOfNotes: 7,
  },
  {
    categoryId: 3,
    categoryName: 'Ideas',
    color: '#8D33FF',
    numberOfNotes: 5,
  },
  {
    categoryId: 5,
    categoryName: 'Shopping',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Dev',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Fitness',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Weight',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Food',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Health',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Shopping',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Shopping',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Shopping',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Shopping',
    color: '#FFC300',
    numberOfNotes: 9,
  },
  {
    categoryId: 5,
    categoryName: 'Shopping',
    color: '#FFC300',
    numberOfNotes: 9,
  },
];

export default function MarkdownEditor() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100dvh-220px)]">
      {demoCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ">
          {demoCategories.map((category) => (
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
