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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, i) {
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
