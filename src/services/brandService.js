let brandData = null;

export const fetchBrandData = async () => {
  if (!brandData) {
    try {
      const response = await fetch('/data/brandInfo.json');
      if (!response.ok) {
        throw new Error('Failed to fetch brand data');
      }
      brandData = await response.json();
    } catch (error) {
      console.error('Error loading brand data:', error);
      // Retourner des données par défaut en cas d'erreur
      brandData = {
        brand: { name: 'La Marque Du Battant' },
        contact: { email: 'contact@lamarquedubattant.com' },
        legal: {}
      };
    }
  }
  return brandData;
};

export const getBrandInfo = async () => {
  const data = await fetchBrandData();
  return data.brand;
};

export const getContactInfo = async () => {
  const data = await fetchBrandData();
  return data.contact;
};

export const getLegalInfo = async () => {
  const data = await fetchBrandData();
  return data.legal;
};

export const getStats = async () => {
  const data = await fetchBrandData();
  return data.stats || {};
};

export const getAboutInfo = async () => {
  const data = await fetchBrandData();
  return data.about || {};
};

export const getShippingInfo = async () => {
  const data = await fetchBrandData();
  return data.shipping || {};
};

export const getReturnsInfo = async () => {
  const data = await fetchBrandData();
  return data.returns || {};
};

export const getSeoInfo = async () => {
  const data = await fetchBrandData();
  return data.seo || {};
};
