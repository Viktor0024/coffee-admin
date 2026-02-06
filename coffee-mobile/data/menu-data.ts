export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  imageUrl: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "coffee",
    title: "Кава",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        id: "coffee-espresso",
        name: "Еспресо",
        description: "Насичена порція кави.",
        price: 3.0,
        imageUrl:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "coffee-latte",
        name: "Лате",
        description: "Ніжний еспресо з підігрітим молоком.",
        price: 4.5,
        imageUrl:
          "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "coffee-cappuccino",
        name: "Капучино",
        description: "Еспресо з підігрітим молоком та пінкою.",
        price: 4.25,
        imageUrl:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "coffee-americano",
        name: "Американо",
        description: "Еспресо з гарячою водою.",
        price: 3.5,
        imageUrl:
          "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "coffee-flat-white",
        name: "Флет Вайт",
        description: "Вершкова кава з мікропінкою.",
        price: 4.0,
        imageUrl:
          "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "coffee-macchiato",
        name: "Макиато",
        description: "Еспресо з невеликою кількістю молочної пінки.",
        price: 3.5,
        imageUrl:
          "https://images.unsplash.com/photo-1510707577718-0b2a2c5302e0?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "coffee-mocha",
        name: "Мокка",
        description: "Еспресо з шоколадом та молоком.",
        price: 4.75,
        imageUrl:
          "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "coffee-raf",
        name: "Раф",
        description: "Кава з вершками та ваніллю.",
        price: 4.5,
        imageUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "coffee-vienna",
        name: "Віденська кава",
        description: "Еспресо зі збитими вершками.",
        price: 4.25,
        imageUrl:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "coffee-affogato",
        name: "Афогато",
        description: "Еспресо з кулькою морозива.",
        price: 5.0,
        imageUrl:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    id: "tea",
    title: "Чай",
    imageUrl:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        id: "tea-green",
        name: "Зелений чай",
        description: "Легкий, свіжий, багатий антиоксидантами.",
        price: 3.0,
        imageUrl:
          "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-black",
        name: "Чорний чай",
        description: "Класичний, насичений і м'який.",
        price: 2.8,
        imageUrl:
          "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-earl-grey",
        name: "Англійський сніданок",
        description: "Чорний чай з ароматом бергамоту.",
        price: 3.2,
        imageUrl:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-chamomile",
        name: "Ромашковий чай",
        description: "М'який, квітковий, заспокійливий.",
        price: 3.1,
        imageUrl:
          "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-mint",
        name: "М'ятний чай",
        description: "Освіжаючий з прохолодним післясмаком.",
        price: 3.0,
        imageUrl:
          "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-oolong",
        name: "Улун",
        description: "Напівферментований чай з ніжним смаком.",
        price: 3.5,
        imageUrl:
          "https://images.unsplash.com/photo-1563822249366-8c2c16f447b1?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-white",
        name: "Білий чай",
        description: "Ніжний, з легким квітковим ароматом.",
        price: 3.4,
        imageUrl:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-hibiscus",
        name: "Каркаде",
        description: "Кисло-солодкий червоний чай.",
        price: 3.0,
        imageUrl:
          "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-chai",
        name: "Чай масала",
        description: "Пряний чай з молоком та спеціями.",
        price: 4.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544785349-c4a5301826fd?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "tea-berry",
        name: "Ягідний чай",
        description: "Фруктовий купаж з ягодами.",
        price: 3.2,
        imageUrl:
          "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    id: "desserts",
    title: "Десерти",
    imageUrl:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        id: "dessert-cheesecake",
        name: "Cheesecake",
        description: "Creamy with a buttery crust.",
        price: 5.5,
        imageUrl:
          "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "dessert-brownie",
        name: "Brownie",
        description: "Fudgy, rich, and chocolatey.",
        price: 4.2,
        imageUrl:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "dessert-croissant",
        name: "Croissant",
        description: "Flaky and buttery, baked fresh.",
        price: 3.8,
        imageUrl:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "dessert-muffin",
        name: "Muffin",
        description: "Soft and sweet, perfect with coffee.",
        price: 3.6,
        imageUrl:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: "ice-cream",
    title: "Морозиво",
    imageUrl:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        id: "ice-cream-vanilla",
        name: "Ваніль",
        description: "Класичне вершкове ванільне.",
        price: 4.0,
        imageUrl:
          "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-chocolate",
        name: "Шоколад",
        description: "Глибокий смак какао.",
        price: 4.2,
        imageUrl:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-strawberry",
        name: "Полуниця",
        description: "Фруктове з натуральними ягодами.",
        price: 4.1,
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-pistachio",
        name: "Фісташка",
        description: "Горіховий смак з нотками солі.",
        price: 4.4,
        imageUrl:
          "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "ice-cream-caramel",
        name: "Карамель",
        description: "Солона карамель з вершками.",
        price: 4.3,
        imageUrl:
          "https://images.unsplash.com/photo-1560008581-98caa6a2a262?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-mango",
        name: "Манго",
        description: "Тропічний фруктовий смак.",
        price: 4.2,
        imageUrl:
          "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-cookie",
        name: "Печиво та вершки",
        description: "З шматочками печива.",
        price: 4.5,
        imageUrl:
          "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-coconut",
        name: "Кокос",
        description: "Ніжний кокосовий смак.",
        price: 4.25,
        imageUrl:
          "https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-berry",
        name: "Лісова ягода",
        description: "Мікс малини, чорниці та ожини.",
        price: 4.35,
        imageUrl:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ice-cream-tiramisu",
        name: "Тірамісу",
        description: "На основі маскарпоне та кави.",
        price: 4.6,
        imageUrl:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
];
