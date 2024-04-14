const newGrid = (size) => {
    let arr = new Array(size);

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);  
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
    }

    return arr;
}

// kiem tra 2 so tren mot cot
const isColSafe = (grid, col, value) => {
    //duyệt qua từng hàng (row) trong bảng Sudoku
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        //ô tại cột col và hàng row đã có giá trị => không an toàn để gán value vào cột
        if (grid[row][col] === value) return false;
    }
    return true; //an toàn
}

// kiem tra 2 so tren mot hang
const isRowSafe = (grid, row, value) => {
     //duyệt qua từng cột (col) trong bảng Sudoku
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
         //ô tại cột col và hàng row đã có giá trị => không an toàn để gán value vào hàng
        if (grid[row][col] === value) return false;
    }
    return true; //an toàn
}

// kiem tra 2 so tren vung 3x3 
const isBoxSafe = (grid, box_row, box_col, value) => {
    //duyệt qua từng hàng(row) 
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        //duyệt qua từng cột(col) 
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            //ô tại hàng row + box_row và cột col + box_col
            if (grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true; //an toàn để gán value vào ô
}

// kiem tra tren hang, cot va vung 3x3
const isSafe = (grid, row, col, value) => {
    return isColSafe(grid, col, value) // an toàn để gán vào cột ?
        && isRowSafe(grid, row, value) // an toàn để gán vào hàng ?
        && isBoxSafe(grid, row - row % 3, col - col % 3, value) //an toàn để gán vào ô vuông con
        && value !== CONSTANT.UNASSIGNED; //giá trị chưa được gán
}

// tim o chua duoc gan
const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) { //duyệt qua từng hàng
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) { //duyệt qua từng cột 
            if (grid[row][col] === CONSTANT.UNASSIGNED) { //ô chưa được gán giá trị
                pos.row = row; //lưu vị trí hàng 
                pos.col = col; //lưu vị trí cột
                return true;
            }
        }
    }
    return false; // không có ô chưa có giá trị
}

// Tron mang
const shuffleArray = (arr) => {
    //Khởi tạo biến chỉ số hiện tại (curr_index) với giá trị bằng độ dài của mảng arr
    let curr_index = arr.length; 

    while (curr_index !== 0) {
        //tạo một số ngẫu nhiên
        let rand_index = Math.floor(Math.random() * curr_index); 
        curr_index -= 1;

        //Hoán đổi giá trị của phần tử arr[curr_index] với phần tử arr[rand_index]
        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }
    //Trả về mảng arr đã được xáo trộn.
    return arr;
}

// kiem tra cau do da hoan thanh hay chua
const isFullGrid = (grid) => {
    //kiểm tra từng hàng trong grid
    return grid.every((row, i) => {
        //kiểm tra từng giá trị trong hàng
        return row.every((value, j) => {
            // tất cả các giá trị có được gán chưa
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

//tạo một bảng Sudoku mới
const sudokuCreate = (grid) => {
    //Khởi tạo một vị trí chưa được gán giá trị
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    //nếu không tìm thấy vị trí chưa được gán giá trị => hoàn thành
    if (!findUnassignedPos(grid, unassigned_pos)) return true;


    //mảng chứa các số từ 1 đến 9 và xáo trộn thứ tự của mảng
    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    //Duyệt qua từng số (num) trong danh sách số đã được xáo trộn
    number_list.forEach((num, i) => {

        //Kiểm tra nếu số num có thể được gán vào ô hiện tại mà không vi phạm luật Sudoku
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num; //giá trị num vào ô hiện tại

            if (isFullGrid(grid)) { //nếu bảng đã được điền đầy
                return true;
            } else { //Nếu bảng chưa điền đầy
                if (sudokuCreate(grid)) {
                    return true; //đã tạo thành công một bảng Sudoku
                }
            }

            //đặt lại giá trị của ô hiện tại về giá trị chưa được gán
            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return isFullGrid(grid);
}

//kiểm tra tính hợp lệ của một lưới Sudoku đã được điền.
const sudokuCheck = (grid) => {

    // khởi tạo vị trí của ô chưa được gán giá trị trong lưới Sudoku
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    //tìm vị trí của ô chưa được gán giá trị
    //không tìm thấy =>lưới đã được điền đầy đủ => hợp lệ
    if (!findUnassignedPos(grid, unassigned_pos)) return true;
    

    //duyệt qua từng ô trong lưới
    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            // kiểm tra giá trị num tại vị trí (i, j) có hợp lệ trong lưới Sudoku hay không
            if (isSafe(grid, i, j, num)) {
                if (isFullGrid(grid)) { //lưới đã được điền đầy đủ => hợp lệ
                    return true;
                } else { //lưới chưa được điền đầy đủ
                    if (sudokuCreate(grid)) { //tạo ra một lưới Sudoku hợp lệ từ lưới hiện tại.
                        return true;
                    }
                }
            }
        })
    })

    return isFullGrid(grid);
}

//tạo một số ngẫu nhiên 
const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);


//loại bỏ một số ô trong lưới Sudoku
const removeCells = (grid, level) => {

    //tạo một bản sao của lưới Sudoku gốc
    let res = [...grid];

    //số ô cần cố gắng loại bỏ 
    let attemps = level;

    while (attemps > 0) {
        //chọn ngẫu nhiên một vị trí ô trong lưới 
        let row = rand();
        let col = rand();
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }
        //loại bỏ giá trị ô
        res[row][col] = CONSTANT.UNASSIGNED;

        attemps--;
    }
    return res;
}

// tao sudoku dua tren lever
const sudokuGen = (level) => {
    //tạo một lưới Sudoku mới
    let sudoku = newGrid(CONSTANT.GRID_SIZE);

    //điền các số vào lưới Sudoku hợp lệ
    let check = sudokuCreate(sudoku);

    //Kiểm tra xem việc tạo lưới Sudoku thành công?
    if (check) { //lưới Sudoku đã được tạo thành công
        //loại bỏ một số ô trong lưới Sudoku dựa trên mức độ level
        let question = removeCells(sudoku, level);
        return {
            original: sudoku, //chứa lưới Sudoku gốc
            question: question // lưới Sudoku câu hỏi
        }
    }
    //Nếu tạo lưới Sudoku không thành công
    return undefined;
}

function isValid(board, row, col, num) {
    // Kiểm tra hàng
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) {
            return false;
        }
    }

    // Kiểm tra cột
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) {
            return false;
        }
    }

    // Kiểm tra ô vuông 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

// Hàm giải Sudoku bằng thuật toán Backtracking
function solveSudoku(board) {
    //duyệt qua từng hàng
    for (let row = 0; row < 9; row++) {
        //Trong mỗi hàng, duyệt qua từng cột
        for (let col = 0; col < 9; col++) {
            //nếu ô hiện tại có giá trị là 0, tức là ô chưa được điền giá trị.
            if (board[row][col] === 0) {                
                for (let num = 1; num <= 9; num++) { //duyệt qua các số từ 1 đến 9 (num) để thử điền vào ô đó
                    //Kiểm tra nếu số num có thể được điền vào ô hiện tại mà không vi phạm luật 
                    if (isValid(board, row, col, num)) {
                        //gán giá trị num cho ô hiện tại
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            //đã tìm thấy giải pháp, thì ngừng đệ quy và trả về true
                            return true;
                        }
                        board[row][col] = 0; // Đặt lại giá trị nếu không tìm được giải pháp
                    }
                }
                return false; // Nếu không tìm được giá trị nào hợp lệ
            }
        }
    }
    return true; // Khi tìm thấy giải pháp
}