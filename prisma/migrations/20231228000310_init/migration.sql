-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "goal" REAL NOT NULL,
    "currentValue" REAL NOT NULL DEFAULT 0,
    "initialDate" DATE NOT NULL,
    "deadline" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalsTransaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "goalsId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,

    CONSTRAINT "GoalsTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "buyDate" DATE NOT NULL,
    "sellDate" DATE NOT NULL,
    "buyPrice" REAL NOT NULL,
    "sellPrice" REAL NOT NULL,
    "stock" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "investmentWalletId" UUID NOT NULL,
    "walletId" UUID NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentWallet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "balance" REAL DEFAULT 0,
    "region" TEXT NOT NULL DEFAULT 'Global',
    "userId" UUID NOT NULL,

    CONSTRAINT "InvestmentWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT,
    "date" DATE NOT NULL,
    "value" REAL NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "walletId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "bankName" TEXT,
    "balance" REAL DEFAULT 0,
    "userId" UUID NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Goals_userId_key" ON "Goals"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GoalsTransaction" ADD CONSTRAINT "GoalsTransaction_goalsId_fkey" FOREIGN KEY ("goalsId") REFERENCES "Goals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GoalsTransaction" ADD CONSTRAINT "GoalsTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investmentWalletId_fkey" FOREIGN KEY ("investmentWalletId") REFERENCES "InvestmentWallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InvestmentWallet" ADD CONSTRAINT "InvestmentWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
