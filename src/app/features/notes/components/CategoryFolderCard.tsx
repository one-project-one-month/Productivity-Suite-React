import { getCategoryIcon } from '@/app/features/notes/components/Icons';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { Card } from '@radix-ui/themes';
import { useNavigate } from 'react-router';

const CategoryFolderCard = ({ category }: { category: NoteCategory }) => {
  const navigate = useNavigate();

  const Icon = getCategoryIcon(category.categoryName);

  const handleCategoryClick = (category: NoteCategory) => {
    console.log(category, 'category in handleCategoryClick');
    navigate(`/app/notes/${category.categoryId}`, {
      state: {
        categoryName: category.categoryName,
        color: category.color,
        categoryId: category.categoryId,
      },
    });
  };

  console.log(category, 'category in CategoryFolderCard');

  return (
    <Card
      key={category.categoryName}
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-slate-100 backdrop-blur-sm border-gray-200 hover:scale-105 rounded-sm"
      // style={{ backgroundColor: category.color + '20' }}
      onClick={() => handleCategoryClick(category)}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <div
            className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: category.color + '40' }}
          >
            <Icon className="w-8 h-8" style={{ color: category.color }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 transition-colors">
            {category.categoryName}
          </h3>
        </div>
        <Badge
          variant="secondary"
          className="text-sm"
          style={{
            backgroundColor: category.color + '30',
            color: '#00000095',
            border: `1px solid ${category.color}30`,
          }}
        >
          {category.numberOfNotes} notes
          {/* 10 Notes */}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default CategoryFolderCard;
