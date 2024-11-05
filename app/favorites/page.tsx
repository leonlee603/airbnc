import EmptyList from '@/components/home/EmptyList';
import PropertiesList from '@/components/home/PropertiesList';
import { fetchFavorites } from '@/utils/actions';

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const favorites = await fetchFavorites(searchParams?.search);

  if (favorites.length === 0) {
    return <EmptyList />;
  }

  return <PropertiesList properties={favorites} />;
}