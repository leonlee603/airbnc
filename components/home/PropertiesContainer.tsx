import { fetchProperties } from '@/utils/actions';
import PropertiesList from '@/components/home/PropertiesList';
import EmptyList from '@/components/home/EmptyList';
import type { PropertyCardProps } from '@/utils/types';

export default async function PropertiesContainer({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const properties: PropertyCardProps[] = await fetchProperties({
    category,
    search,
  });

  if (properties.length === 0) {
    return (
      <EmptyList
        heading='No results.'
        message='Try changing or removing some of your filters.'
        btnText='Clear Filters'
      />
    );
  }

  return <PropertiesList properties={properties} />;
}