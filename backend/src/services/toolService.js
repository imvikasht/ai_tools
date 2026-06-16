import { toolCatalog } from "../data/tools.js";
import { generateAiContent } from "./aiService.js";

const getToolBySlug = (slug) => toolCatalog.find((tool) => tool.slug === slug);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value || 0));

const toNumber = (value) => Number(value);

const toolExecutors = {
  formula: async (payload) => {
    const expression = String(payload.expression || "").replace(/[^-()*/+.\d\s]/g, "");
    if (!expression.trim()) {
      throw new Error("Enter a valid mathematical expression.");
    }
    const result = Function(`"use strict"; return (${expression})`)();
    return { expression, result };
  },
  gst: async (payload) => {
    const amount = Number(payload.amount);
    const gstRate = Number(payload.gstRate);
    const isInclusive = Boolean(payload.isInclusive);
    if (Number.isNaN(amount) || Number.isNaN(gstRate)) {
      throw new Error("Amount and GST rate are required.");
    }
    if (isInclusive) {
      const baseAmount = amount / (1 + gstRate / 100);
      const gstAmount = amount - baseAmount;
      return {
        mode: "Inclusive",
        baseAmount: formatCurrency(baseAmount),
        gstAmount: formatCurrency(gstAmount),
        total: formatCurrency(amount)
      };
    }
    const gstAmount = (amount * gstRate) / 100;
    return {
      mode: "Exclusive",
      baseAmount: formatCurrency(amount),
      gstAmount: formatCurrency(gstAmount),
      total: formatCurrency(amount + gstAmount)
    };
  },
  emi: async (payload) => {
    const principal = Number(payload.principal);
    const annualRate = Number(payload.annualRate);
    const years = Number(payload.years);
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    if ([principal, annualRate, years].some(Number.isNaN)) {
      throw new Error("Principal, interest rate, and years are required.");
    }
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
    return {
      monthlyEmi: formatCurrency(emi),
      totalPayment: formatCurrency(emi * months),
      totalInterest: formatCurrency(emi * months - principal)
    };
  },
  simpleinterest: async (payload) => {
    const principal = toNumber(payload.principal);
    const annualRate = toNumber(payload.annualRate);
    const years = toNumber(payload.years);
    if ([principal, annualRate, years].some(Number.isNaN)) {
      throw new Error("Principal, annual rate, and years are required.");
    }
    const interest = (principal * annualRate * years) / 100;
    return {
      principal: formatCurrency(principal),
      interest: formatCurrency(interest),
      maturityAmount: formatCurrency(principal + interest)
    };
  },
  compoundinterest: async (payload) => {
    const principal = toNumber(payload.principal);
    const annualRate = toNumber(payload.annualRate);
    const years = toNumber(payload.years);
    const compoundsPerYear = toNumber(payload.compoundsPerYear || 12);
    if ([principal, annualRate, years, compoundsPerYear].some(Number.isNaN) || compoundsPerYear <= 0) {
      throw new Error("Principal, annual rate, years, and compounding frequency are required.");
    }
    const amount = principal * (1 + annualRate / 100 / compoundsPerYear) ** (compoundsPerYear * years);
    return {
      investedAmount: formatCurrency(principal),
      estimatedReturns: formatCurrency(amount - principal),
      maturityAmount: formatCurrency(amount)
    };
  },
  percentage: async (payload) => {
    const value = Number(payload.value);
    const percentage = Number(payload.percentage);
    if ([value, percentage].some(Number.isNaN)) {
      throw new Error("Value and percentage are required.");
    }
    return {
      percentageValue: (value * percentage) / 100,
      increasedValue: value + (value * percentage) / 100,
      decreasedValue: value - (value * percentage) / 100
    };
  },
  percentdiff: async (payload) => {
    const firstValue = toNumber(payload.firstValue);
    const secondValue = toNumber(payload.secondValue);
    if ([firstValue, secondValue].some(Number.isNaN)) {
      throw new Error("Both values are required.");
    }
    const difference = Math.abs(firstValue - secondValue);
    const average = (Math.abs(firstValue) + Math.abs(secondValue)) / 2;
    return {
      firstValue,
      secondValue,
      absoluteDifference: difference,
      percentageDifference: average ? ((difference / average) * 100).toFixed(2) : "0.00"
    };
  },
  cgpa: async (payload) => {
    const cgpa = Number(payload.cgpa);
    const multiplier = Number(payload.multiplier || 9.5);
    if (Number.isNaN(cgpa)) {
      throw new Error("CGPA is required.");
    }
    return { cgpa, percentage: (cgpa * multiplier).toFixed(2), formula: `${cgpa} x ${multiplier}` };
  },
  attendance: async (payload) => {
    const totalClasses = Number(payload.totalClasses);
    const attendedClasses = Number(payload.attendedClasses);
    const targetPercentage = Number(payload.targetPercentage || 75);
    if ([totalClasses, attendedClasses, targetPercentage].some(Number.isNaN)) {
      throw new Error("Attendance details are required.");
    }
    const currentPercentage = totalClasses ? (attendedClasses / totalClasses) * 100 : 0;
    let classesNeeded = 0;
    if (currentPercentage < targetPercentage) {
      classesNeeded = Math.ceil((targetPercentage * totalClasses - 100 * attendedClasses) / (100 - targetPercentage));
    }
    return { currentPercentage: currentPercentage.toFixed(2), targetPercentage, classesNeeded };
  },
  bmi: async (payload) => {
    const weightKg = Number(payload.weightKg);
    const heightCm = Number(payload.heightCm);
    if ([weightKg, heightCm].some(Number.isNaN) || heightCm <= 0) {
      throw new Error("Weight and height are required.");
    }
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    return { bmi: bmi.toFixed(2), category, weightKg, heightCm };
  },
  discount: async (payload) => {
    const originalPrice = Number(payload.originalPrice);
    const discountPercent = Number(payload.discountPercent);
    if ([originalPrice, discountPercent].some(Number.isNaN)) {
      throw new Error("Original price and discount percent are required.");
    }
    const savings = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - savings;
    return {
      originalPrice: formatCurrency(originalPrice),
      savings: formatCurrency(savings),
      finalPrice: formatCurrency(finalPrice)
    };
  },
  tip: async (payload) => {
    const billAmount = toNumber(payload.billAmount);
    const tipPercent = toNumber(payload.tipPercent || 10);
    const people = Math.max(1, toNumber(payload.people || 1));
    if ([billAmount, tipPercent, people].some(Number.isNaN)) {
      throw new Error("Bill amount, tip percent, and people count are required.");
    }
    const tipAmount = (billAmount * tipPercent) / 100;
    const totalAmount = billAmount + tipAmount;
    return {
      billAmount: formatCurrency(billAmount),
      tipAmount: formatCurrency(tipAmount),
      totalAmount: formatCurrency(totalAmount),
      perPerson: formatCurrency(totalAmount / people)
    };
  },
  splitbill: async (payload) => {
    const totalAmount = toNumber(payload.totalAmount);
    const people = Math.max(1, toNumber(payload.people || 1));
    const extraCharges = toNumber(payload.extraCharges || 0);
    if ([totalAmount, people, extraCharges].some(Number.isNaN)) {
      throw new Error("Total amount, people count, and extra charges are required.");
    }
    const finalAmount = totalAmount + extraCharges;
    return {
      originalAmount: formatCurrency(totalAmount),
      finalAmount: formatCurrency(finalAmount),
      people,
      perPerson: formatCurrency(finalAmount / people)
    };
  },
  age: async (payload) => {
    const birthDate = new Date(payload.birthDate);
    if (Number.isNaN(birthDate.getTime())) {
      throw new Error("A valid birth date is required.");
    }
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    return {
      birthDate: birthDate.toISOString().split("T")[0],
      age: `${years} years, ${months} months, ${days} days`
    };
  },
  wordcount: async (payload) => {
    const text = String(payload.text || "");
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const readingTimeMinutes = (words / 200).toFixed(2);
    return { words, characters, charactersNoSpaces, readingTimeMinutes };
  },
  dedupe: async (payload) => {
    const text = String(payload.text || "");
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const uniqueLines = [...new Set(lines)];
    return {
      originalCount: lines.length,
      uniqueCount: uniqueLines.length,
      removedDuplicates: lines.length - uniqueLines.length,
      cleanedText: uniqueLines.join("\n")
    };
  },
  palindrome: async (payload) => {
    const text = String(payload.text || "");
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    return {
      input: text,
      normalizedText: cleaned,
      isPalindrome: cleaned.length > 0 ? cleaned === cleaned.split("").reverse().join("") : false
    };
  },
  caseconvert: async (payload) => {
    const text = String(payload.text || "");
    const titleCase = text
      .toLowerCase()
      .split(" ")
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
      .join(" ");
    const sentenceCase = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
    return {
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      titleCase,
      sentenceCase
    };
  },
  breakeven: async (payload) => {
    const fixedCost = Number(payload.fixedCost);
    const pricePerUnit = Number(payload.pricePerUnit);
    const variableCostPerUnit = Number(payload.variableCostPerUnit);
    if ([fixedCost, pricePerUnit, variableCostPerUnit].some(Number.isNaN) || pricePerUnit <= variableCostPerUnit) {
      throw new Error("Enter valid fixed cost, price per unit, and variable cost per unit.");
    }
    const units = fixedCost / (pricePerUnit - variableCostPerUnit);
    return {
      breakEvenUnits: Math.ceil(units),
      contributionPerUnit: formatCurrency(pricePerUnit - variableCostPerUnit)
    };
  },
  margin: async (payload) => {
    const sellingPrice = Number(payload.sellingPrice);
    const costPrice = Number(payload.costPrice);
    if ([sellingPrice, costPrice].some(Number.isNaN) || sellingPrice <= 0) {
      throw new Error("Valid selling price and cost price are required.");
    }
    const profit = sellingPrice - costPrice;
    const marginPercent = (profit / sellingPrice) * 100;
    const markupPercent = costPrice ? (profit / costPrice) * 100 : 0;
    return {
      profit: formatCurrency(profit),
      marginPercent: marginPercent.toFixed(2),
      markupPercent: markupPercent.toFixed(2)
    };
  },
  savingsgoal: async (payload) => {
    const targetAmount = toNumber(payload.targetAmount);
    const monthlyContribution = toNumber(payload.monthlyContribution);
    const currentSavings = toNumber(payload.currentSavings || 0);
    if ([targetAmount, monthlyContribution, currentSavings].some(Number.isNaN) || monthlyContribution <= 0) {
      throw new Error("Target amount and monthly contribution are required.");
    }
    const remainingAmount = Math.max(targetAmount - currentSavings, 0);
    const monthsNeeded = monthlyContribution ? Math.ceil(remainingAmount / monthlyContribution) : 0;
    return {
      targetAmount: formatCurrency(targetAmount),
      currentSavings: formatCurrency(currentSavings),
      remainingAmount: formatCurrency(remainingAmount),
      monthsNeeded
    };
  },
  salaryhike: async (payload) => {
    const currentSalary = toNumber(payload.currentSalary);
    const hikePercent = toNumber(payload.hikePercent);
    if ([currentSalary, hikePercent].some(Number.isNaN)) {
      throw new Error("Current salary and hike percent are required.");
    }
    const increaseAmount = (currentSalary * hikePercent) / 100;
    const revisedSalary = currentSalary + increaseAmount;
    return {
      currentSalary: formatCurrency(currentSalary),
      increaseAmount: formatCurrency(increaseAmount),
      revisedSalary: formatCurrency(revisedSalary)
    };
  },
  fuelcost: async (payload) => {
    const distanceKm = toNumber(payload.distanceKm);
    const mileageKmPerLitre = toNumber(payload.mileageKmPerLitre);
    const fuelPricePerLitre = toNumber(payload.fuelPricePerLitre);
    if ([distanceKm, mileageKmPerLitre, fuelPricePerLitre].some(Number.isNaN) || mileageKmPerLitre <= 0) {
      throw new Error("Distance, mileage, and fuel price are required.");
    }
    const litresNeeded = distanceKm / mileageKmPerLitre;
    return {
      distanceKm,
      litresNeeded: litresNeeded.toFixed(2),
      estimatedCost: formatCurrency(litresNeeded * fuelPricePerLitre)
    };
  },
  electricity: async (payload) => {
    const unitsConsumed = toNumber(payload.unitsConsumed);
    const ratePerUnit = toNumber(payload.ratePerUnit);
    const fixedCharge = toNumber(payload.fixedCharge || 0);
    if ([unitsConsumed, ratePerUnit, fixedCharge].some(Number.isNaN)) {
      throw new Error("Units consumed, rate per unit, and fixed charge are required.");
    }
    const energyCharge = unitsConsumed * ratePerUnit;
    return {
      unitsConsumed,
      energyCharge: formatCurrency(energyCharge),
      fixedCharge: formatCurrency(fixedCharge),
      estimatedBill: formatCurrency(energyCharge + fixedCharge)
    };
  },
  grade: async (payload) => {
    const marksObtained = toNumber(payload.marksObtained);
    const totalMarks = toNumber(payload.totalMarks);
    if ([marksObtained, totalMarks].some(Number.isNaN) || totalMarks <= 0) {
      throw new Error("Marks obtained and total marks are required.");
    }
    const percentage = (marksObtained / totalMarks) * 100;
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";
    return {
      marksObtained,
      totalMarks,
      percentage: percentage.toFixed(2),
      grade
    };
  },
  json: async (payload) => ({ formattedJson: JSON.stringify(JSON.parse(String(payload.rawJson || "")), null, 2) }),
  markdown: async (payload) => ({
    preview: String(payload.markdown || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n")
  }),
  unit: async (payload) => {
    const value = Number(payload.value);
    const mode = payload.mode || "length";
    if (Number.isNaN(value)) {
      throw new Error("Numeric value is required.");
    }
    if (mode === "weight") {
      return { kilograms: value, grams: value * 1000, pounds: (value * 2.20462).toFixed(2) };
    }
    if (mode === "temperature") {
      return { celsius: value, fahrenheit: (value * 9) / 5 + 32, kelvin: value + 273.15 };
    }
    return { meters: value, centimeters: value * 100, feet: (value * 3.28084).toFixed(2) };
  },
  password: async (payload) => {
    const length = Math.max(8, Number(payload.length || 12));
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    const password = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return { password, strength: length >= 14 ? "Strong" : "Moderate" };
  },
  invoice: async (payload) => {
    const client = payload.client || "Client";
    const service = payload.service || "Service";
    const amount = Number(payload.amount || 0);
    return {
      summary: `Invoice prepared for ${client} covering ${service}.`,
      amount: formatCurrency(amount),
      note: "You can extend this module to generate downloadable PDF invoices."
    };
  },
  pomodoro: async (payload) => {
    const sessions = Number(payload.sessions || 4);
    const focusMinutes = Number(payload.focusMinutes || 25);
    const breakMinutes = Number(payload.breakMinutes || 5);
    return {
      totalFocusTime: `${sessions * focusMinutes} minutes`,
      totalBreakTime: `${sessions * breakMinutes} minutes`,
      plan: Array.from({ length: sessions }, (_, index) => `Session ${index + 1}: Focus ${focusMinutes} min + Break ${breakMinutes} min`)
    };
  },
  ai: async (payload, tool) => ({
    content: await generateAiContent({
      toolSlug: tool.slug,
      toolName: tool.name,
      prompt: payload.prompt || payload.topic || payload.idea || "Create a useful response",
      extra: payload
    })
  })
};

export const executeTool = async ({ slug, payload }) => {
  const tool = getToolBySlug(slug);
  if (!tool) {
    const error = new Error("Tool not found");
    error.statusCode = 404;
    throw error;
  }
  const executor = toolExecutors[tool.type];
  if (!executor) {
    const error = new Error("Tool execution is not available");
    error.statusCode = 400;
    throw error;
  }
  return { tool, output: await executor(payload, tool) };
};
