import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ItemDetails from '../components/ItemDetails';

const ItemDetailsPage: React.FC = () => {
  return (
    <MainLayout>
      <ItemDetails />
    </MainLayout>
  );
};

export default ItemDetailsPage;
