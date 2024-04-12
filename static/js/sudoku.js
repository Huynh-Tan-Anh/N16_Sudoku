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
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

// kiem tra 2 so tren mot hang
const isRowSafe = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

// kiem tra 2 so tren vung 3x3 
const isBoxSafe = (grid, box_row, box_col, value) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if (grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}

// kiem tra tren hang, cot va vung 3x3
const isSafe = (grid, row, col, value) => {
    return isColSafe(grid, col, value) && isRowSafe(grid, row, value) && isBoxSafe(grid, row - row%3, col - col%3, value) && value !== CONSTANT.UNASSIGNED;
}

// tim o chua duoc gan
const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

// Tron mang
const shuffleArray = (arr) => {
    let curr_index = arr.length;

    while (curr_index !== 0) {
        let rand_index = Math.floor(Math.random() * curr_index);
        curr_index -= 1;

        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }

    return arr;
}

// kiem tra cau do da hoan thanh hay chua
const isFullGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    number_list.forEach((num, i) => {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (isFullGrid(grid)) {
                return true;
            } else {
                if (sudokuCreate(grid)) {
                    return true;
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return isFullGrid(grid);
}

const sudokuCheck = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(grid, i, j, num)) {
                if (isFullGrid(grid)) {
                    return true;
                } else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }
            }
        })
    })

    return isFullGrid(grid);
}

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = [...grid];
    let attemps = level;
    while (attemps > 0) {
        let row = rand();
        let col = rand();
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attemps--;
    }
    return res;
}

// tao sudoku dua tren lever
const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined;
}

// Hàm giải Sudoku
const sudokuSolver = (puzzle) => {
   

    const findEmpty = (puz) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puz[r][c] === 0) return [r, c];
            }
        }
        return null;
    };

    const isValid = (num, pos, puz) => {
        // Kiểm tra hàng
        for (let i = 0; i < 9; i++) {
            if (puz[pos[0]][i] === num && i !== pos[1]) return false;
        }

        // Kiểm tra cột
        for (let i = 0; i < 9; i++) {
            if (puz[i][pos[1]] === num && i !== pos[0]) return false;
        }

        // Kiểm tra hộp 3x3
        const boxRow = Math.floor(pos[0] / 3) * 3;
        const boxCol = Math.floor(pos[1] / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (puz[boxRow + i][boxCol + j] === num && boxRow + i !== pos[0] && boxCol + j !== pos[1]) {
                    return false;
                }
            }
        }

        return true;
    };

    const solve = () => {
        const currPos = findEmpty(puzzle);

        if (currPos === null) return true;

        for (let i = 1; i <= 9; i++) {
            if (isValid(i, currPos, puzzle)) {
                const [x, y] = currPos;
                puzzle[x][y] = i;

                if (solve()) return true;

                puzzle[x][y] = 0;
            }
        }

        return false;
    };

    solve();
    return puzzle;
};
/*
// Hàm kiểm tra Sudoku
const sudokuCheck = (solution) => {

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = solution[row][col];
            if (num === 0 || !isValid(num, [row, col], solution)) {
                return false;
            }
        }
    }

    return true;
};

// Hàm giải Sudoku
const solveSudoku = () => {
    
    su_answer = sudokuSolver(su.original);

    // Cập nhật giao diện với lời giải
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        cells[i].innerHTML = su_answer[row][col];
        cells[i].classList.add('filled');
    }

    // Kiểm tra xem lời giải có đúng không và hiển thị kết quả
    if (sudokuCheck(su_answer)) {
        showResult();
    } else {
        alert('Có lỗi xảy ra, không thể giải Sudoku này.');
    }
}
*/
const solveSudoku = () => {
    if (solving) {
        // Sudoku đang được giải, không làm gì
        return;
    }

    solving = true;

    // Hiển thị thông báo hoặc hiệu ứng cho việc giải Sudoku đang diễn ra
    // Ví dụ: Hiển thị một thông báo "Đang giải Sudoku..." hoặc thêm một hiệu ứng loading

    // Tạo một bản sao của ma trận Sudoku để thực hiện giải Sudoku
    const sudokuCopy = [...sudoku];

    // Hàm đệ quy để giải Sudoku
    const solve = () => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudokuCopy[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValidMove(sudokuCopy, row, col, num)) {
                            sudokuCopy[row][col] = num;

                            // Hiển thị quá trình giải Sudoku trên giao diện
                            // Ví dụ: Cập nhật giá trị của ô vuông Sudoku

                            if (solve()) {
                                return true;
                            }

                            sudokuCopy[row][col] = 0;

                            // Hiển thị quá trình giải Sudoku trên giao diện
                            // Ví dụ: Cập nhật giá trị của ô vuông Sudoku để hiển thị quá trình backtracking
                        }
                    }

                    return false;
                }
            }
        }

        return true;
    };

    // Gọi hàm đệ quy để giải Sudoku
    solve();

    // Khi quá trình giải Sudoku hoàn thành

    // Hiển thị Sudoku đã được giải
    // Ví dụ: Cập nhật các ô vuông Sudoku trên giao diện với các giá trị đã giải

    solving = false;
};

function updateSudokuUI(sudokuData) {
    const mainSudokuGrid = document.querySelector('.main-sudoku-grid');
    const cells = mainSudokuGrid.querySelectorAll('.main-grid-cell');

    for (let i = 0; i < 81; i++) {
        const cellValue = sudokuData[i] === 0 ? '' : sudokuData[i];
        cells[i].textContent = cellValue;
    }
}
