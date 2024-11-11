const button = document.querySelector('.main_button');
const wrapper = document.querySelector('.wrapper');
const main = document.querySelector('.main');
let height = 8;
let width = 8;
let bombs = 13;

wrapper.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {//у браузерів імена тегів у верхньому регістрі
        const heightClass = wrapper.querySelector('.input_height');
        const widthClass = wrapper.querySelector('.input_width');
        const bombsClass = wrapper.querySelector('.input_bombs');
        height = heightClass.value;
        width = widthClass.value;
        bombs = bombsClass.value;

        if (height < 0 || width < 0 || bombs < 0) {
            alert('Введи коректні дані');
        } else if (height > 13 || width > 13 || bombs > 61) {
            alert('Введи коректні дані');
        } else if (height === '' || width === '' || bombs === '') {
            alert('Введи коректні дані');
        } else if (!/^\d+$/.test(height) || !/^\d+$/.test(width) || !/^\d+$/.test(bombs)) {
            alert('Введи коректні дані');
        } else {
            main.classList.add('disabled_main');
            return startGame(width, height, bombs);
        }
    };
});






function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
    const field = document.querySelector('.field'); // поле сапера взяли у js
    const cellsCount = WIDTH * HEIGHT; // кількість бомб у сапері нашому
    field.innerHTML = '<button></button>'.repeat(cellsCount); //в поле додали кнопки у нас це ячейки
    const cells = [...field.children]; // масив кнопок всіх!

    let closedCount = cellsCount;

    const bombs = [...Array(cellsCount).keys()]
    .sort(() => Math.random() - 0.5) // -> це все означає типу створює масив де деякі кнопки будуть бомбами
    .slice(0, BOMBS_COUNT);




    field.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON') {//у браузерів імена тегів у верхньому регістрі
            return; //типу нічого не робимо, такий клік не обробляємо
        } 
        

        const index = cells.indexOf(event.target); // знаходить індекс елемента, на який було натиснуто, у масиві cells 
        const column = index % WIDTH; // це типу ми шукаємо колонку в ОДНОВИМІРНОМУ МАСИВІ
        const row = Math.floor(index / WIDTH);
        openCell(row, column);
    });




    function isValid(row, column) { // тут визначаємо чи ряд і колонка може існувати на полі
        return row >= 0
        && row < HEIGHT
        && column < WIDTH
        && column >= 0;
    }





    function getBombCount(row, column) {
        let count = 0; //буде збільшуватись щоразу, коли знайдеться сусідня клітинка з бомбою.
        //бере сусідні ячейки і перебирає їх
        for (let x = -1; x <= 1; x++) {//Використовуються вкладені цикли для проходження по всіх сусідніх клітинках
            for (let y = -1; y <= 1; y++) {//Використовуються вкладені цикли для проходження по всіх сусідніх клітинках
                if (isBomb(row + y, column + x)) {//Для кожної сусідньої клітинки викликається функція isBomb, якщо цій клітинці бомба, кількість бомб(count) збільшиться на 1
                    count++;
                }
            }   
        }
        return count;
    }




    //ФУНКЦІЯ ЩО ДАЄ МІНІ X ПРИ ВІДКРИТТІ І ВСІМ КНОПКА КЛАС DISABLED
    function openCell(row, column) {
        if (!isValid(row, column)) return;

        const index = row * WIDTH + column; //знаходимо індекс кнопки
        const cell = cells[index];//в змінну cell вставляємо значення кнопки за індексом, значення шукається у масиві
        
        if (cell.disabled === true) return;

        cell.disabled = true; // ті кнопки що клікнув стають сірими
        cell.classList.add('disabled'); //ті кнопки що клікаєш отримують клас disabled

        if (isBomb(row, column)) {
            cell.classList.add('disabled_bomb');
            cell.innerHTML = '';
            alert('ТИ ПРОГРАВ-)');
            return location.reload();
        }

        closedCount--;
        if (closedCount <= BOMBS_COUNT) {
            alert('ТИ ВИГРАВ-)');
            return location.reload();
        }

        const count = getBombCount(row, column); // якщо cell є бомбою то x інше буде числом.

        if (count !== 0) {
            cell.innerHTML = count;
            return;
        }

         for (let x = -1; x <= 1; x++) {//Використовуються вкладені цикли для проходження по всіх сусідніх клітинках
            for (let y = -1; y <= 1; y++) {//Використовуються вкладені цикли для проходження по всіх сусідніх клітинках
                openCell(row + y, column + x);//рекурсія
            }   
        }
    }





    /* функція яка буде взначати чи кнопка просто чи це бомба */
    function isBomb(row, column) {/* передаємо ряд і колонку елемента */
        if (!isValid(row, column)) return false; // тут перевіряється чи валідна колнка і стовпець
        
        const index = row * WIDTH + column; /* визначаємо індекс елемента, для пошуку його у одновимірному масиві bombs*/
        return bombs.includes(index); //чи є наш індекс у масиві
    }
}