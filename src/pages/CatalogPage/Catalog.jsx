import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import CatalogItem from "../../components/CatalogItem/CatalogItem.jsx"
import Filter from "../../components/Filters/Filter";
import allFilters from "../../../src/assets/icons/allFilters.svg"
import './Catalog.css';

const SERVER_URL = 'https://power-store-plovaks.amvera.io';

const specNameMap = {
    "Сопротивление": "Внутреннее сопротивление"
};

export default function Catalog() {
    const [items, setItems] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/products`);
                if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.log(`error: ${error}`);
            }
        };
        fetchProducts();
    }, []);

    const getOptionsForFilter = (filterName) => {
        let cleanName = filterName.split(',')[0].trim();
        cleanName = specNameMap[cleanName] || cleanName;

        const allValues = items.flatMap(item => item.specs
            .filter(spec => spec.name === cleanName)
            .map(spec => spec.value)
        );
        return [...new Set(allValues)].sort((a, b) => parseFloat(a) - parseFloat(b));
    };
    const resetFilters = () => {
        setSelectedFilters({}); 
    };
    const handleFilterChange = (filterName, value) => {
        setSelectedFilters(prev => {
            const currentSelected = prev[filterName] || [];
            const isSelected = currentSelected.includes(value);
            const newSelected = isSelected 
                ? currentSelected.filter(item => item !== value) 
                : [...currentSelected, value];
            return { ...prev, [filterName]: newSelected };
        });
    };

    const filteredItems = items.filter(item => {
        return Object.keys(selectedFilters).every(filterName => {
            const values = selectedFilters[filterName];
            if (!values || values.length === 0) return true;
            let cleanName = filterName.split(',')[0].trim();
            cleanName = specNameMap[cleanName] || cleanName;

            const itemSpec = item.specs.find(spec => spec.name === cleanName);
            return itemSpec && values.includes(itemSpec.value);
        });
    });

    const filters = [
        { id: 1, name: "Емкость, мАч" },
        { id: 2, name: "Напряжение, В" },
        { id: 3, name: "Сопротивление, мОм" }, 
        { id: 4, name: "Вес, г" },
        { id: 5, name: "Диаметр, мм" }
    ];

    return (
        <div className="catalog" id='catalog'>
            <h1 className="catalog__title">КАТАЛОГ ТОВАРОВ</h1>
            <div className="catalog__wrapper">
                <div className="catalog__filters">
                {filters.map(filter => (
                    <Filter 
                        key={filter.id} 
                        name={filter.name} 
                        options={getOptionsForFilter(filter.name)} 
                        selectedOptions={selectedFilters[filter.name] || []} 
                        onFilterChange={(value) => handleFilterChange(filter.name, value)} 
                    />
                ))}
            </div>
            <div className="catalog__container">
                <button 
                className="filters__mobile"
                onClick={() => setIsMobileFiltersOpen(true)}
            >
                <img src={allFilters} alt="" />
                Все фильтры
            </button>
            {isMobileFiltersOpen && (
                <div className="mobile-filters-overlay">
                    <div className="mobile-filters-content">
                    <div className="mobile-filters-header">
                        <h3>Фильтры</h3>
                        <button className="close-btn" onClick={() => setIsMobileFiltersOpen(false)}>✕</button>
                    </div>
          
                    {filters.map(filter => (
                        <Filter 
                        key={filter.id} 
                        name={filter.name} 
                        options={getOptionsForFilter(filter.name)} 
                        selectedOptions={selectedFilters[filter.name] || []} 
                        onFilterChange={(value) => handleFilterChange(filter.name, value)} 
                        />
                    ))}
          
                    <button className="apply-btn" onClick={() => setIsMobileFiltersOpen(false)}>Применить</button>
                    <button className="reset-btn" onClick={resetFilters}>
                        Сбросить всё
                    </button>
                    </div>
                </div>
            )}
            <div className="catalog__sections">
                <span className="catalog__sec--img">Фото</span>
                <span className="catalog__sec--name">Название</span>
                <span className="catalog__sec--capacity">Емкость, мАч</span>
                <span className="catalog__sec--volt">Напряжение, В</span>
                <span className="catalog__sec--resist">Сопротивление, мОм</span>
                <span className="catalog__sec--price">Цена</span>
                <span></span>
            </div>

            <div className="catalog__items">
                {filteredItems.map(item => (
                    <Link to={`/product/${item.id}`} key={item.id} state={{ background: location }}>
                        <CatalogItem 
                            id={item.id}
                            img={item.images?.length > 0 ? `${SERVER_URL}${item.images[0].url}` : ''} 
                            name={`${item.model} ${item.name}`} 
                            capcity={item.specs.find(s => s.name === "Емкость")?.value} 
                            voltage={item.specs.find(s => s.name === "Напряжение")?.value} 
                            resistance={item.specs.find(s => s.name === "Внутреннее сопротивление")?.value} 
                            price={item.price} 
                        />
                    </Link>
                ))}
            </div>
            </div>
            </div>
            
            
        </div>
    );
}
