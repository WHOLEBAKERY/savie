document.addEventListener('DOMContentLoaded', () => {

  const initialUser = {
  
  id: 1,
  
  name: '',
  
  balance: 0,
  
  transactions: [],
  
  profilePicture: '',
  
  backgroundPicture: ''
  
  };
  
  
  // Retrieve user data from localStorage or set default values
  
  const user = JSON.parse(localStorage.getItem('user')) || initialUser;
  
  
  // Elements
  
  const userDetailsElement = document.getElementById('user-details');
  
  const transactionHistoryElement = document.getElementById('transaction-history');
  
  const transactionForm = document.getElementById('transaction-form');
  
  const clearHistoryButton = document.getElementById('clear-history');
  
  const clearBalanceButton = document.getElementById('clear-balance');
  
  const errorMessageElement = document.getElementById('error-message');
  
  const historyLogElement = document.getElementById('history-log-details');
  
  const userSetupModal = document.getElementById('user-setup-modal');
  
  const userSetupForm = document.getElementById('user-setup-form');
  
  const previewContainer = document.getElementById('preview-container');
  
  const changeUserInfoButton = document.getElementById('change-user-info');
  
  const cancelSetupButton = document.getElementById('cancel-setup');
  
  const bgSetupModal = document.getElementById('bg-setup-modal');
  
  const bgSetupForm = document.getElementById('bg-setup-form');
  
  const bgPreviewContainer = document.getElementById('bg-preview-container');
  
  const changeBgButton = document.getElementById('change-bg');
  
  const cancelBgButton = document.getElementById('cancel-bg');
  
  
  // Save user data to localStorage
  
  const saveUser = () => {
  
  localStorage.setItem('user', JSON.stringify(user));
  
  };
  
  
  // Save history log to localStorage
  
  const saveHistoryLog = (log) => {
  
  localStorage.setItem('historyLog', JSON.stringify(log));
  
  };
  
  
  // Load history log from localStorage
  
  const loadHistoryLog = () => {
  
  return JSON.parse(localStorage.getItem('historyLog')) || [];
  
  };
  
  
  // Render user details
  
  const renderUserDetails = () => {
  
  userDetailsElement.innerHTML = `
  
  <div>
  
  <strong>Name:</strong> ${user.name}
  
  ${user.profilePicture ? `<img src="${user.profilePicture}" alt="Profile Picture" class="profile-picture">` : ''}
  
  </div>
  
  <p><strong>Balance:</strong> <span style="color: green;">$${user.balance.toFixed(2)}</span></p>
  
  `;
  
  };
  
  
  // Render transaction history
  
  const renderTransactionHistory = () => {
  
  if (user.transactions.length === 0) {
  
  transactionHistoryElement.innerHTML = '<p>No transactions yet.</p>';
  
  } else {
  
  transactionHistoryElement.innerHTML = user.transactions.map(transaction => `
  
  <div class="transaction">
  
  <span>${transaction.date} ${transaction.time}</span>
  
  <span>${transaction.type}</span>
  
  <span>$${transaction.amount.toFixed(2)}</span>
  
  </div>
  
  `).join('');
  
  }
  
  };
  
  
  // Render history log
  
  const renderHistoryLog = () => {
  
  const historyLog = loadHistoryLog();
  
  if (historyLog.length === 0) {
  
  historyLogElement.innerHTML = '<p>No history log yet.</p>';
  
  } else {
  
  historyLogElement.innerHTML = historyLog.map(log => `
  
  <div class="log">
  
  <span>History cleared on: ${log.date} ${log.time}</span>
  
  </div>
  
  `).join('');
  
  }
  
  };
  
  
  // Handle form submission
  
  transactionForm.addEventListener('submit', (e) => {
  
  e.preventDefault();
  
  const type = document.getElementById('transaction-type').value;
  
  const amount = parseFloat(document.getElementById('transaction-amount').value);
  
  
  // Error handling for withdrawal
  
  if (type === 'withdrawal' && amount > user.balance) {
  
  errorMessageElement.textContent = 'Unable to withdraw more than you have.';
  
  errorMessageElement.style.display = 'block';
  
  return;
  
  }
  
  
  errorMessageElement.style.display = 'none';
  
  
  // Create transaction
  
  const transaction = {
  
  id: user.transactions.length + 1,
  
  type,
  
  amount,
  
  date: new Date().toISOString().split('T')[0],
  
  time: new Date().toLocaleTimeString()
  
  };
  
  
  // Update user balance
  
  user.transactions.push(transaction);
  
  user.balance = type === 'deposit' ? user.balance + amount : user.balance - amount;
  
  
  // Save and render updates
  
  saveUser();
  
  renderUserDetails();
  
  renderTransactionHistory();
  
  transactionForm.reset();
  
  });
  
  
  // Handle clear history button click
  
  clearHistoryButton.addEventListener('click', () => {
  
  if (confirm('Are you sure you want to clear the transaction history?')) {
  
  // Save log of history clearance
  
  const logEntry = {
  
  date: new Date().toISOString().split('T')[0],
  
  time: new Date().toLocaleTimeString()
  
  };
  
  const historyLog = loadHistoryLog();
  
  historyLog.push(logEntry);
  
  saveHistoryLog(historyLog);
  
  
  // Clear user transactions
  
  user.transactions = [];
  
  saveUser();
  
  
  // Render updates
  
  renderTransactionHistory();
  
  renderHistoryLog();
  
  }
  
  });
  
  
  // Handle clear balance button click
  
  clearBalanceButton.addEventListener('click', () => {
  
  if (confirm('Are you sure you want to clear your balance?')) {
  
  user.balance = 0;
  
  saveUser();
  
  renderUserDetails();
  
  }
  
  });
  
  
  // Handle user setup form submission
  
  userSetupForm.addEventListener('submit', (e) => {
  
  e.preventDefault();
  
  user.name = document.getElementById('user-name').value;
  
  const profilePictureFile = document.getElementById('user-picture').files[0];
  
  const reader = new FileReader();
  
  reader.onload = function () {
  
  user.profilePicture = reader.result;
  
  saveUser();
  
  renderUserDetails();
  
  userSetupModal.style.display = 'none';
  
  };
  
  reader.readAsDataURL(profilePictureFile);
  
  });
  
  
  // Handle cancel setup button click
  
  cancelSetupButton.addEventListener('click', () => {
  
  userSetupModal.style.display = 'none';
  
  });
  
  
  // Handle change user info button click
  
  changeUserInfoButton.addEventListener('click', () => {
  
  userSetupModal.style.display = 'flex';
  
  });
  
  
  // Handle background setup form submission
  
  bgSetupForm.addEventListener('submit', (e) => {
  
  e.preventDefault();
  
  const bgPictureFile = document.getElementById('bg-picture').files[0];
  
  const reader = new FileReader();
  
  reader.onload = function () {
  
  user.backgroundPicture = reader.result;
  
  document.body.style.background = `url(${user.backgroundPicture}) no-repeat center center fixed`;
  
  document.body.style.backgroundSize = 'cover';
  
  saveUser();
  
  bgSetupModal.style.display = 'none';
  
  };
  
  reader.readAsDataURL(bgPictureFile);
  
  });
  
  
  // Handle cancel background button click
  
  cancelBgButton.addEventListener('click', () => {
  
  bgSetupModal.style.display = 'none';
  
  });
  
  
  // Handle change background button click
  
  changeBgButton.addEventListener('click', () => {
  
  bgSetupModal.style.display = 'flex';
  
  });
  
  
  // Render user details and transaction history on page load
  
  renderUserDetails();
  
  renderTransactionHistory();
  
  renderHistoryLog();
  
  
  // Show user setup modal if no user data is found
  
  if (!user.name || !user.profilePicture) {
  
  userSetupModal.style.display = 'flex';
  
  } else if (user.backgroundPicture) {
  
  document.body.style.background = `url(${user.backgroundPicture}) no-repeat center center fixed`;
  
  document.body.style.backgroundSize = 'cover';
  
  }
  
  });