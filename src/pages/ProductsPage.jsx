import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  products,
  getCategories,
  getProductsByCategory,
} from "../data/productsData";

const ProductsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCards, setExpandedCards] = useState({});

  const categories = getCategories();
  const filteredProducts = getProductsByCategory(activeFilter);
  const totalCount = filteredProducts.length;

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const groupedProducts = () => {
    if (activeFilter !== "all") {
      return { [activeFilter]: filteredProducts };
    }

    const grouped = {};
    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  };

  const grouped = groupedProducts();

  const getCategoryTitle = (categoryId) => {
    const titles = {
      electronics: "Электронные и электромеханические изделия",
      chem: "Специальные технические жидкости и химическая продукция",
      equipment: "Промышленная оснастка и нестандартное оборудование",
      metal: "Металлообработка и точное машиностроение",
      polymer: "Полимерные и композитные изделия",
    };
    return titles[categoryId] || "";
  };

  return (
    <div className="products-page">
      <Header />

      <section className="products-hero">
        <div className="container">
          <div className="products-hero__tag">ФКП Авангард</div>
          <h1 className="products-hero__title">Наша продукция</h1>
        </div>
      </section>

      <div className="products-content">
        <div className="container">
          <div className="products-filters">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              Все <span className="filter-count">{products.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeFilter === cat.id ? "active" : ""}`}
                onClick={() => setActiveFilter(cat.id)}
              >
                {cat.name} <span className="filter-count">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="results-count">
            Показано: <span>{totalCount}</span> позиций
          </div>

          {Object.entries(grouped).map(([catId, catProducts]) => (
            <div key={catId} className="product-category">
              <div className="category-header">
                <span className="category-title">
                  {getCategoryTitle(catId)}
                </span>
                <div className="category-line"></div>
                <span className="category-badge">
                  {catProducts.length} позиции
                </span>
              </div>
              <div className="cards-grid">
                {catProducts.map((product) => {
                  const isExpanded = expandedCards[product.id];
                  const needsExpand = product.description.length > 120;

                  return (
                    <div
                      key={product.id}
                      className={`product-card product-card--${product.category}`}
                    >
                      <div className={`card-img card-img--${product.category}`}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        >
                          {product.category === "electronics" && (
                            <>
                              <rect x="4" y="4" width="16" height="16" rx="2" />
                              <rect x="9" y="9" width="6" height="6" />
                              <line x1="9" y1="2" x2="9" y2="4" />
                              <line x1="15" y1="2" x2="15" y2="4" />
                              <line x1="9" y1="20" x2="9" y2="22" />
                              <line x1="15" y1="20" x2="15" y2="22" />
                              <line x1="20" y1="9" x2="22" y2="9" />
                              <line x1="20" y1="14" x2="22" y2="14" />
                              <line x1="2" y1="9" x2="4" y2="9" />
                              <line x1="2" y1="14" x2="4" y2="14" />
                            </>
                          )}
                          {product.category === "chem" && (
                            <>
                              <path d="M9 3h6l1 9H8L9 3z" />
                              <path d="M8 12c0 0-2 2-2 5a6 6 0 0012 0c0-3-2-5-2-5" />
                            </>
                          )}
                          {product.category === "equipment" && (
                            <>
                              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                            </>
                          )}
                          {product.category === "metal" && (
                            <>
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M12 2v2M12 20v2" />
                            </>
                          )}
                          {product.category === "polymer" && (
                            <>
                              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                            </>
                          )}
                        </svg>
                        <span
                          className={`card-cat card-cat--${product.category}`}
                        >
                          {product.categoryName}
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="card-code">{product.code}</div>
                        <div className="card-title">{product.title}</div>
                        <div
                          className={`card-desc ${!isExpanded ? "collapsed" : ""}`}
                        >
                          {product.description}
                        </div>
                        {needsExpand && (
                          <div className="card-footer">
                            <button
                              className="card-toggle"
                              onClick={() => toggleExpand(product.id)}
                            >
                              {isExpanded ? "Свернуть ↑" : "Показать больше ↓"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="quality-section">
            <div className="quality-info">
              <div className="quality-title">Контроль качества</div>
              <div className="quality-text">
                <p>
                  Вся продукция ФКП Авангард проходит многоступенчатый контроль
                  на каждом этапе производства.
                </p>
                <p>
                  Предприятие работает в соответствии с требованиями
                  государственных стандартов и имеет необходимые сертификаты для
                  поставок в оборонно-промышленный комплекс.
                </p>
              </div>
              <div className="quality-checks">
                <div className="quality-check">
                  <div className="check-dot"></div>Соответствие ГОСТ и ТУ
                </div>
                <div className="quality-check">
                  <div className="check-dot"></div>Входной контроль сырья
                </div>
                <div className="quality-check">
                  <div className="check-dot"></div>Лабораторные испытания
                </div>
                <div className="quality-check">
                  <div className="check-dot"></div>Сертификаты на каждую партию
                </div>
              </div>
            </div>
            <div className="quality-image">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.2"
                strokeLinecap="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
