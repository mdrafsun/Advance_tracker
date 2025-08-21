class reportInterface
{
    viewReport() {
        throw new Error("viewReport() must be implemented by subclass");
    }
    saveReport() {
        throw new Error("saveReport() must be implemented by subclass");
    }
}

class OverallReport extends reportInterface
{
    #reportID;
    #startDate = new Date();
    #endDate = new Date();
    #incomeList = [];
    #expenseList = [];
    #savingsList = [];
    #loansList = [];
    #bankName;
    constructor(reportID, startDate, endDate, incomeList, expenseList, savingsList, loansList, bankName)
    {
        super();
        this.#reportID = reportID;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#incomeList = incomeList;
        this.#expenseList = expenseList;
        this.#savingsList = savingsList;  
        this.#loansList = loansList;
        this.#bankName = bankName; 
    }

    viewReport()
    {
        //This function will pass info to the frontend and do the graphs and stuff   
    }
    saveReport()
    {
        //SQL Insert
    }
}

class CashFlowReport extends reportInterface
{
    #reportID;
    #startDate = new Date();
    #endDate = new Date();
    #incomeList = [];
    #expenseList = [];
    constructor(reportID, startDate, endDate, incomeList, expenseList)
    {
        super();
        this.#reportID = reportID;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#incomeList = incomeList;
        this.#expenseList = expenseList; 
    }

    viewReport()
    {
        //This function will pass info to the frontend and do the graphs and stuff   
    }
    saveReport()
    {
        //SQL Insert
    }
    
}

class BankReport extends reportInterface
{
    #reportID;
    #startDate = new Date();
    #endDate = new Date();
    #savingsList = [];
    #loansList = [];
    #bankName;
    constructor(reportID, startDate, endDate, savingsList, loansList, bankName)
    {
        super();
        this.#reportID = reportID;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#savingsList = savingsList;  
        this.#loansList = loansList;
        this.#bankName = bankName;   
    }

    viewReport()
    {
        //This function will pass info to the frontend and do the graphs and stuff   
    }
    saveReport()
    {
        //SQL Insert
    }
    
}

class ReportFactory
{
    FactoryType() {
        throw new Error("FactoryType() must be implemented by subclass");
    }
    GenerateReport(...args)
    {
        let report = this.FactoryType(...args);
        return report;
    }
}

class OverallReportFactory extends ReportFactory
{
    FactoryType(reportID, startDate, endDate, incomeList, expenseList, savingsList, loansList, bankName)
    {
        return new OverallReport(reportID, startDate, endDate, incomeList, expenseList, savingsList, loansList, bankName);
    }
}

class CashFlowReportFactory extends ReportFactory
{
    FactoryType(reportID, startDate, endDate, incomeList, expenseList)
    {
        return new CashFlowReport(reportID, startDate, endDate, incomeList, expenseList);
    }
}

class BankReportFactory extends ReportFactory
{
    FactoryType(reportID, startDate, endDate, savingsList, loansList, bankName)
    {
        return new BankReport(reportID, startDate, endDate, savingsList, loansList, bankName);
    }
}

module.exports = {
    OverallReport,
    CashFlowReport,
    BankReport,
    OverallReportFactory,
    CashFlowReportFactory,
    BankReportFactory
};
