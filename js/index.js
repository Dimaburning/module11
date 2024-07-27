// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
console.log()
// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  fruitsList.innerHTML = '';
  // чтобы заполнить актуальными данными из fruits

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let fruitData = document.createElement('li');
    let fruitColor = '';
    switch (fruits[i]['color']) {
      case 'фиолетовый':
        fruitColor = 'fruit_violet';
        break;
      case 'зеленый':
        fruitColor = 'fruit_green';
        break;
      case 'розово-красный':
        fruitColor = 'fruit_carmazin';
        break;
      case 'желтый':
        fruitColor = 'fruit_yellow';
        break;
      case 'светло-коричневый':
        fruitColor = 'fruit_lightbrown';
        break;
      default:
    }
    fruitData.className = `fruit__item ${fruitColor}`;

    fruitData.innerHTML = `<div class="fruit__info">
                                <div>index: ${i}</div>
                                <div>color: ${fruits[i]['color']}</div>
                                <div>weight: ${fruits[i]['weight']}</div>
                                <div>fruit: ${fruits[i]['kind']}</div>
                            </div>`;
    fruitsList.appendChild(fruitData);
  }
};


// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива!!!
const shuffleFruits = () => {
  for (let i = fruits.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i); // случайное число используется как индекс элемента, с которым будет произведена замена
    [fruits[i], fruits[j]] = [fruits[j], fruits[i]]; // деструктурирующее присваивание
  }
  display(fruits);
};

shuffleButton.addEventListener('click', () => {
  try {
    shuffleFruits();
  } catch (error) {
    alert('Упс, что-то пошло не так... ' + error);
  }
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minWeight = parseInt(document.querySelector('.minweight__input').value, 10);
  const maxWeight = parseInt(document.querySelector('.maxweight__input').value, 10);
  fruits = fruits.filter(fruit => fruit.weight >= minWeight && fruit.weight <= maxWeight);
  display(fruits);
};

filterButton.addEventListener('click', filterFruits);

/*** СОРТИРОВКА!!!! ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const colorPriority = ['фиолетовый', 'зеленый', 'розово-красный', 'желтый', 'светло-коричневый'];
  return colorPriority.indexOf(a.color) - colorPriority.indexOf(b.color);
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
      if (comparation(arr[i], pivot) < 0) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    return this.quickSort(left, comparation).concat(pivot, this.quickSort(right, comparation));
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = performance.now();
    if (sort === 'quickSort') {
      arr = this.quickSort(arr, comparation);
    } else {
      this.bubbleSort(arr, comparation);
    }
    const end = performance.now();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseInt(weightInput.value.trim(), 10);

  if (kind && color && !isNaN(weight)) {
    const newFruit = {
      kind: kind,
      color: color,
      weight: weight
    };
    fruits.push(newFruit);
    display(fruits);
  } else {
    alert('Введите данные фрукта.');
  }
});
