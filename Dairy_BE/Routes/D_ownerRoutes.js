import express from 'express';
import { addCowFeedStock, addFarmer, addFarmerMilkCount, allocateCowFeed, calculateCowFeedPriceAndBags, calculateFarmersTodaysCowFeedPriceAndBags, calculateFinalTotalPrice, calculateTotalCowFeedPrice, calculateTotalMilkPriceOfFarmer, callculateFarmersTodaysMilkCountAndPrice, callculateTodaysMilkCountAndPrice, deleteFarmer, editMilkPrice, farmersEmiTransactionHistory, farmersMilkpriceHistory, farmersTenDaysCowFeed, farmerTenDaysMilkilkCollection, generateBill, getAllAdvancePaymentList, getAllCowFeedTrannsaction, getAllCowFeedTransactionAsPerDate, getAllDairyOwnerEmiTransaction, getAllEmiTransaction, getAllFarmers, getAllMilkCollectionAsPerDate, getAllPayments, getCowFeedDetails, getCowFeedTransactionOfFarmerAsPerDate, getFarmerAdvancePayment, getFarmerAllCowFeedTransaction, getFarmerAllMilkTransaction, getFarmerPaymentHistory, getMilkCountdetails, getMilkData, getMilkPriceAtThatDate, getMilkPriceHistory, getMonthlyEmi, getTodaysMilkPrice, makeAdvancePayment, makeEmipayment, makePayment, sendMilkTransactionPdf, setMilkRate, tenDaysDairyOwnerCowFeedAllocationData, tenDaysDairyOwnermilkCollection, todaysMilkCountDetails } from '../Controller/D_ownerController.js';
import farmername from '../Middleware/farmername.js';
import { generateMilkTransactionPDF } from '../Middleware/generateMilkTranscationPDF.js';

 const D_ownerRouter=express.Router();

 D_ownerRouter.post('/get-all-farmers',getAllFarmers);
 D_ownerRouter.post('/add-farmer',addFarmer);
 D_ownerRouter.post('/delete-farmer',deleteFarmer);
 D_ownerRouter.post('/set-milk-price',setMilkRate);
 D_ownerRouter.post('/add-farmer-milkcount',farmername,addFarmerMilkCount);
 D_ownerRouter.post('/allocate-cowfeed',farmername,allocateCowFeed);
 D_ownerRouter.post('/make-advance-payment',farmername,makeAdvancePayment);
 D_ownerRouter.get('/milk-transaction-details',getMilkCountdetails);
 D_ownerRouter.post('/get-farmer-all-milk-transaction',getFarmerAllMilkTransaction);
 D_ownerRouter.post('/get-todays-milkprice',getTodaysMilkPrice);
 D_ownerRouter.post('/todays-milk-count-details',todaysMilkCountDetails);
 D_ownerRouter.post('/add-cowFeed-stock',addCowFeedStock);
 D_ownerRouter.post('/get-cowfeed-details',getCowFeedDetails);
 D_ownerRouter.post('/get-All-cowfeed-transactions',getAllCowFeedTrannsaction);
 D_ownerRouter.post('/get-All-cowfeed-transactions-asper-date',getAllCowFeedTransactionAsPerDate);
 D_ownerRouter.post('/get-All-milk-transactions-asper-date',getAllMilkCollectionAsPerDate);
 D_ownerRouter.post('/get-farmer-cowfeed-transactions',getFarmerAllCowFeedTransaction);
 D_ownerRouter.post('/get-farmer-cowfeed-transactions-asper-date',getCowFeedTransactionOfFarmerAsPerDate);
 D_ownerRouter.post('/get-all-advance-payment-list',getAllAdvancePaymentList);
 D_ownerRouter.post('/get-milk-price-history',getMilkPriceHistory);
 D_ownerRouter.post('/calculate-total-milk-price',calculateTotalMilkPriceOfFarmer);
 D_ownerRouter.post('/calculate-total-allocated-cowFeed',calculateTotalCowFeedPrice);
 D_ownerRouter.post('/get-monthly-emi',getMonthlyEmi);
 D_ownerRouter.post('/calculate-final-total-price',calculateFinalTotalPrice);
 D_ownerRouter.post('/send-milk-transaction-file',farmername,generateMilkTransactionPDF,sendMilkTransactionPdf);
 D_ownerRouter.post('/generate-bill',farmername,generateBill);
 D_ownerRouter.post('/make-payment',farmername,makePayment);
 D_ownerRouter.post('/make-emi-payment',farmername,makeEmipayment);
 D_ownerRouter.post('/get-all-emi-transaction',getAllEmiTransaction);
 D_ownerRouter.post('/calculate-todays-milk-price-liters',callculateTodaysMilkCountAndPrice);
 D_ownerRouter.post('/calculate-todays-cowFeed-price-bags',calculateCowFeedPriceAndBags);
 D_ownerRouter.post('/get-all-payment-transaction',getAllPayments);
 D_ownerRouter.post('/ten-days-dairyOwner-milkCollection',tenDaysDairyOwnermilkCollection);
 D_ownerRouter.post('/ten-days-dairyOwner-cowFeedAllocation',tenDaysDairyOwnerCowFeedAllocationData);
 D_ownerRouter.post('/get-all-DairyOwnerEmiTransactions',getAllDairyOwnerEmiTransaction);
 D_ownerRouter.post('/calculate-farmers-todays-milk-price-liters',callculateFarmersTodaysMilkCountAndPrice);
 D_ownerRouter.post('/calculate-farmers-todays-cowFeed-price-bags',calculateFarmersTodaysCowFeedPriceAndBags);
 D_ownerRouter.post('/get-farmer-milkPrice-history',farmersMilkpriceHistory);
 D_ownerRouter.post('/get-farmer-emiTransaction-history',farmersEmiTransactionHistory);
 D_ownerRouter.post('/get-farmer-Ten-Days-Milk-Collection',farmerTenDaysMilkilkCollection);
 D_ownerRouter.post('/get-farmer-Ten-Days-cowFeed',farmersTenDaysCowFeed);
 D_ownerRouter.post('/get-farmer-Paymnet-Transaction',getFarmerPaymentHistory);
 D_ownerRouter.post('/get-farmer-advance-payment',getFarmerAdvancePayment);
 D_ownerRouter.post('/edit-milk-price',editMilkPrice);
  D_ownerRouter.get('/get-milk-data',getMilkData);


 D_ownerRouter.post('/get-milk-price-as-per-date',getMilkPriceAtThatDate);


export default  D_ownerRouter;