import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetailsSection from "../components/ProductDetailsSection";
import ProduitSimilaireCtaSection from "../components/ProduitSimilaireCtaSection";
// import articlesData from "../data/articles.json";

export default function DetailsProduits() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(process.env.PUBLIC_URL + '/data/articles.json')
        .then(res => res.json())
        .then(data => {
          const foundProduct = data.find(article => article.id === parseInt(id));
          if (foundProduct) {
            setProduct({
              ...foundProduct,
              images: foundProduct.images ? foundProduct.images : [foundProduct.image]
            });
          } else {
            setProduct(null);
          }
        });
    } else {
      setProduct({
        title: "T-shirt classique",
        category: "Tshirt",
        price: 55,
        summary: "Ce t-shirt classique est fait en coton doux et respirant. Il est parfait pour un look décontracté au quotidien.",
        image: process.env.PUBLIC_URL + "/assets/images/hero.webp",
        sizes: ["S", "M", "XL"],
        details: "Ce t-shirt est fabriqué à partir de matériaux de haute qualité pour assurer confort et durabilité. Il est disponible en plusieurs tailles. Idéal pour toutes les occasions.",
      });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="DetailsProduit">
        {/* Header utilise le contexte pour le panier */}
        <Header showCategoriesBar={false} opacity={100} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
            <p className="text-gray-600">Le produit que vous recherchez n'existe pas.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="DetailsProduit">
      {/* Header utilise le contexte pour le panier */}
      <Header showCategoriesBar={false} opacity={100} />
      <ProductDetailsSection product={product} />
      {product && <ProduitSimilaireCtaSection currentProduct={product} />}
      <Footer />
    </div>
  );
}
