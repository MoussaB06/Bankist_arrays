'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type} ">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${movement}€</div>
        </div>`;

    // voir sur MDN
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserNames(accounts);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  });

  const balanceValue = document.querySelector('.balance__value');
  balanceValue.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumIn.textContent = `${incomes}€`;

  const outcome = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .map(function (mov) {
      return mov * -1;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumOut.innerHTML = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int) {
      return int > 1;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumInterest.innerHTML = `${interest}€`;
};

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};
//Event Handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent from submiting
  e.preventDefault();

  //cette fonction retourne le compte qui satisfait la condition
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Clear Input Field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //updating the UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  //to not refresh the page like above!
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.username !== receiverAcc.username &&
    currentAccount.balance >= amount
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov > amount * 0.1;
    })
  ) {
    //add movement
    currentAccount.movements.push(amount);

    //updateUI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    //Delete Account
    accounts.splice(index, 1);

    //Hiding the UI
    containerApp.style.opacity = 0;
  }
  //Clearing the Inputs
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/*
const user = 'Steven Thomas Williams'; //stw
const username = user
  .toLowerCase()
  .split(' ')
  .map(word => word[0])
  .join('');
console.log(username);
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

//SLICE
let arr = ['a', 'b', 'c', 'd', 'e'];
const arr1 = arr.slice(2, 4);
// console.log(arr.slice(2, 4)); je commence a extraire apartir la 2ieme
// console.log(arr.slice(-1)); extraire la derniere

//SPLICE
let tab = ['a', 'b', 'c', 'd', 'e'];
// ce n'est pas une copie de tab on a qu'un seul et le deuxieme argument veut dire le nombre d'element qu'on veut supprimé pas comme "SLICE"
//console.log(tab.splice(2));
tab.splice(-1);
// console.log(tab);

//REVERSE
let tableau = ['j', 'i', 'h', 'g', 'f'];
tableau.reverse();
// ce n'est pas une copie it mutated
// console.log(tableau.reverse());

//CONCAT
const letters = arr.concat(tableau);
// console.log(letters);
// console.log([...arr, ...tableau]);
// console.log(letters.join('  '));

//AT
const tabl = [23, 10, 90];
// console.log(tabl[tabl.length - 1]);
// console.log(tabl.slice(-1));
// console.log(tabl.at(-1));
//  WORKS WITH STRINGS TOO !
// console.log('moussa'.at(0));

//LOOPING ARRAYS FOR EACH
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
for (const [i,movement] of movements.entries()) {
  if (movement > 0) console.log(`Movement ${i+1}: You deposited ${movement}`);
  else console.log(`Movement ${i+1}: You withdrew ${Math.abs(movement)}`);
}
*/

/*
// order of the argument matter!
movements.forEach(function (movement, i, arr) {
  if (movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
  else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
});
*/

/*

//FOR EACH WITH MAPS AND SETS
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  // console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'EUR', 'GPB', 'USD']);
currenciesUnique.forEach(function (value, _, set) {
  // console.log(`${value}: ${value}`);
});

// exercice

const checkDogs = function (juliaDogs, kateDogs) {
  const juliaDogsCoppy = juliaDogs.slice();
  juliaDogsCoppy.splice(0, 1);
  juliaDogsCoppy.splice(-2, 2);

  const dogs = juliaDogsCoppy.concat(kateDogs);
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog >= 3)
      console.log(
        `the dog number ${i + 1} is an adult and his age is ${dog} old `
      );
    else console.log(`the dog number ${i + 1} is still a poppy 🐶 `);
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 2, 9, 1, 10]);
*/

const euroToUsd = 1.1;

//MAP
/*
 const movementsUsd = movements.map(function (mov) {
  return mov * euroToUsd;
 });
const movementsUsd = movements.map(mov => mov * euroToUsd);
*/
// console.log(movements);
// console.log(movementsUsd);

//FOR-OF LOOP
const movementsToUsd = [];
for (const move of movements) {
  movementsToUsd.push(move * euroToUsd);
}
// console.log(movementsToUsd);

const movementsDescription = movements.map(function (mov, i) {
  return `Movement ${
    i + 1
  }: You ${mov > 0 ? 'deposited' : 'withdrawal'} ${mov}`;
});
// console.log(movementsDescription);

//FILTER
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
// console.log(movements);
// console.log(deposits);

//FOR-OF LOOP
const depositOf = [];
for (const mov of movements) {
  if (mov > 0) depositOf.push(mov);
}
// console.log(depositOf);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
// console.log(withdrawals);

const withdrawalsOf = [];
for (const mov of movements) {
  if (mov < 0) withdrawalsOf.push(mov);
}
// console.log(withdrawalsOf);

//REDUCE
/*
const balance1 = movements.reduce(function (acc, mov, i, arr) {
  console.log(`iteraton${i} : ${acc}`);
  return acc + mov;
}, 0);
console.log(movements);
console.log(balance1);

let sum = 0;
for (const mov of movements) {
  sum = sum + mov;
}
console.log(sum);
*/

const max = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
// console.log(max);

//EXERCICE 2
/*
const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(function (age, i) {
    if (age <= 2) return 2 * age;
    else return 16 + 4 * age;
  });

  const adultDogs = humanAges.filter(function (age, i) {
    return age >= 18;
  });
  console.log(adultDogs);

  const averageDogs =
    adultDogs.reduce(function (acc, dog, i) {
      return acc + dog;
    }, 0) / adultDogs.length;

  return averageDogs;
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
*/
const eurToUsd = 1.1;

const totalDepositsUSD = movements
  .filter(function (move) {
    return move > 0;
  })
  .map(function (mov) {
    return Math.trunc(mov * eurToUsd);
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

/*
  const calcAverageHumanAge = function (ages) {
    const humanAges = ages.map(function (age, i) {
      if (age <= 2) return 2 * age;
      else return 16 + 4 * age;
    })
   
    const adultDogs = humanAges.filter(function (age, i) {
    return age >= 18;
  });
  console.log(adultDogs);

  const averageDogs =
    adultDogs.reduce(function (acc, dog, i) {
      return acc + dog;
    }, 0) / adultDogs.length;

  return averageDogs;

*/

/*
const Data1 = [5, 2, 4, 1, 15, 8, 3];
const Data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const newAges = ages
    .map(function (age) {
      return age <= 2 ? 2 * age : 16 + age * 4;
    })
    .filter(function (age) {
      return age >= 18;
    })
    .reduce(function (acc, dog, _, arr) {
      return acc + dog / arr.length;
    }, 0);

  console.log(newAges);
};

calcAverageHumanAge(Data1);
calcAverageHumanAge(Data2);

*/

//FIND
const firstWithDrawal = movements.find(function (mov) {
  return mov < 0;
});
// find nous retournera le premier mov negatif

//the difference between find and filter is find teyired la premiere valeur negatif et filter itiyired un nouveau tableau zyes ikel les valeur ni negatid
// console.log(movements);
// console.log(firstWithDrawal);
// console.log(accounts);

const account = accounts.find(function (acc) {
  return acc.owner === 'Jessica Davis';
});

//INCLUDES
// console.log(movements);
// console.log(movements.includes(-130));  return true or false ,dans notre cas on nous retourne true car on a cette valeur dans notre tab

//SOME
const anyDeposit = movements.some(function (mov) {
  return mov > 0;
});
// console.log(anyDeposit); return true because we satisfy the condition

//EVERY
// console.log(account4.movements.every(mov => mov > 0));

//separate callback
const deposit = mov => mov > 0;
// console.log(movements.every(deposit));

//FLAT
const arrr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arrr.flat());

const arrrDeep = [[1, [2, 3]], [[4, 5], 6], 7, 8];
// console.log(arrrDeep.flat(2));

/*
const movementAccount = accounts.map(function (acc) {
  return acc.movements;
});
console.log(movementAccount);

const allMovements = movementAccount.flat();
console.log(movementAccount.flat());

const overalBalance = allMovements.reduce(function (acc, mov) {
  return acc + mov;
}, 0);
*/

//Exemple With FLAT

//dans ce cas on a créer un tableau de tableau en suite avec flat on l'a rendu un seul tableau
const overalBalance = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
// console.log(overalBalance);

//Exemple With FLAT_MAP
const overalBalancee = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })

  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
// console.log(overalBalancee);

//SORTING
const owners = ['jonas', 'moussa', 'zizou', 'adem'];
// console.log(owners.sort()); // de A a Z
// console.log(owners); // il est muté

// With Numbers

//return < 0 , A , B (keep orders)
//return > 0 , B , A (swith orders)

/*
movements.sort(function (a, b) {
  //a et b c'est deux nombre qui ce suit
  if (b > a) {
    return -1;
  }

  if (b < a) {
    return 1;
  }
});
*/
movements.sort((a, b) => a - b);
// console.log(movements);

//FILL
const x = new Array(10);
// x.fill(10, 5); // on insere 10 aprartir de la 5ieme
x.fill(10, 3, 5); // on insere 10 aprartir de la 3ieme jusqu'a la 4ieme (non la 5ieme)
// console.log(x);

const arrrr = [1, 2, 3, 4, 5, 6, 7];
arrrr.fill(23, 5, 6);
// console.log(arrrr);

// ARRAY.FROM
const y = Array.from({ length: 7 }, () => 1);
const z = Array.from({ length: 7 }, (curr, i) => i + 1);

labelBalance.addEventListener('click', function () {
  //document.querySelectorAll('.movements__value') n'est pas un vrai tableau
  //c'est une node-list alors on l'a convertit en vrai
  //tableau avec Array.from() et la Array.from() a comme deuxieme argument
  // une callback-function

  const movementsUI = Array.from(
    //on retire les sommes d'argent on enleve le '€' et on les affiche
    document.querySelectorAll('.movements__value'),
    function (movUI) {
      return Number(movUI.textContent.replace('€', ''));
    }
  );

  console.log(movementsUI);
});

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
//console.log(bankDepositSum);

// 2.

// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, curr) => (curr >= 1000 ? ++acc : acc), 0);

// console.log(numDeposit1000);

// 3.

const { Deposits, Withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (acc, mv) => {
      // mv > 0 ? (acc.Deposits += mv) : (acc.Withdrawals += mv);
      acc[mv > 0 ? 'Deposits' : 'Withdrawals'] += mv;
      return acc;
    },
    { Deposits: 0, Withdrawals: 0 }
  );

// console.log(Deposits, Withdrawals);

// 4.

const convertTitleCase = function (title) {
  const capitalize = function (str) {
    return str[0].toUpperCase() + str.slice(1);
  };

  const exceptions = ['a', 'an', 'but', 'the', 'and', 'or', 'on', 'with', 'in'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

// console.log(convertTitleCase('and this is a nice title'));

// CODING CHALENGE 4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// Declarations des fonctions

// 1.
const calculateRecommendedFood = function (dogs) {
  dogs.forEach(function (dog) {
    dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  });
};

// 2.
const findSarahDog = function (dogs) {
  const dogS = dogs.find(function (dog) {
    return dog.owners.includes('Sarah');
  });

  const sarahDog = `Sara's Dog is eating ${
    dogS.currFood > dogS.recommendedFood ? 'too much' : 'too litle'
  }`;
  console.log(sarahDog);
};

// 3.
const ownersOfDogsEatingToMuch = function (dogs) {
  const ownerDogs = dogs
    .filter(dog => dog.curFood > dog.recommendedFood)
    .flatMap(dog => dog.owners);

  return ownerDogs;
};

const ownersOfDogsEatingToLittle = function (dogs) {
  const ownerDogs = dogs
    .filter(dog => dog.curFood < dog.recommendedFood)
    .flatMap(dog => dog.owners);

  return ownerDogs;
};

// 4.
const logOwnersEatingHabits = function () {
  console.log(`${ownersEatTooMuch.join(' and ')}'s dogs are eating too much! `);
  console.log(
    `${ownersEatTooLittle.join(' and ')}'s dogs are eating too little! `
  );
};

// 5.
const logExactlyAmount = function (dogs) {
  const sameAmountDogs = dogs.some(dog => dog.currFood === dog.recommendedFood);
  console.log(sameAmountDogs);
};

// 6.
const logOkAmount = function (dogs) {
  const OkAmount = dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood > dog.recommendedFood * 1.1
  );

  return OkAmount;
};

// 7.
const logDogOkAmount = function (dogs) {
  const dogOkAmount = dogs.filter(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood > dog.recommendedFood * 1.1
  );
  console.log(dogOkAmount);
};

// 8.
const dogsCoppy = function (dogs) {
  const dogsSorted = dogs
    .slice()
    .sort((a, b) => a.recommendedFood - b.recommendedFood); // a et b sont les objets successifs

  console.log(dogsSorted);
};

//Appel des fonctions

// 1
calculateRecommendedFood(dogs);

// 2
findSarahDog(dogs);

// 3
const ownersEatTooMuch = ownersOfDogsEatingToMuch(dogs);
const ownersEatTooLittle = ownersOfDogsEatingToLittle(dogs);

// 4
logOwnersEatingHabits();

// 5
logExactlyAmount(dogs);

// 6
console.log('Dogs eating an okay amount:', logOkAmount(dogs));

// 7
logDogOkAmount(dogs);

// 8
dogsCoppy(dogs);
