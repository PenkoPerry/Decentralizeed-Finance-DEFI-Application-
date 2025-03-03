export const lendingPoolAbi = [
  // Supply
  {
    "inputs": [
      { "name": "asset", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "onBehalfOf", "type": "address" },
      { "name": "referralCode", "type": "uint16" }
    ],
    "name": "supply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Withdraw
  {
    "inputs": [
      { "name": "asset", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "to", "type": "address" }
    ],
    "name": "withdraw",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Borrow
  {
    "inputs": [
      { "name": "asset", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "interestRateMode", "type": "uint256" },
      { "name": "referralCode", "type": "uint16" },
      { "name": "onBehalfOf", "type": "address" }
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Repay
  {
    "inputs": [
      { "name": "asset", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "rateMode", "type": "uint256" },
      { "name": "onBehalfOf", "type": "address" }
    ],
    "name": "repay",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get User Account Data
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "getUserAccountData",
    "outputs": [
      { "name": "totalCollateralETH", "type": "uint256" },
      { "name": "totalDebtETH", "type": "uint256" },
      { "name": "availableBorrowsETH", "type": "uint256" },
      { "name": "currentLiquidationThreshold", "type": "uint256" },
      { "name": "ltv", "type": "uint256" },
      { "name": "healthFactor", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get Reserve Data
  {
    "inputs": [{ "name": "asset", "type": "address" }],
    "name": "getReserveData",
    "outputs": [
      { "name": "configuration", "type": "uint256" },
      { "name": "liquidityIndex", "type": "uint128" },
      { "name": "variableBorrowIndex", "type": "uint128" },
      { "name": "currentLiquidityRate", "type": "uint128" },
      { "name": "currentVariableBorrowRate", "type": "uint128" },
      { "name": "currentStableBorrowRate", "type": "uint128" },
      { "name": "lastUpdateTimestamp", "type": "uint40" },
      { "name": "aTokenAddress", "type": "address" },
      { "name": "stableDebtTokenAddress", "type": "address" },
      { "name": "variableDebtTokenAddress", "type": "address" },
      { "name": "interestRateStrategyAddress", "type": "address" },
      { "name": "id", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;