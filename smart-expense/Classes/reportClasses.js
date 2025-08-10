class reportInterface
{
    viewReport(){};
    saveReport(){};
}

class OverallReport extends reportInterface
{
    #reportID;
    #startDate= new Date();
    #endDate= new Date();
    #IncomeList=[];
    #ExpenseList=[];
    #SavingsList=[];
    #LoansList=[];
    #bankname;
    constructor(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        this.#reportID=reportID;
        this.#startDate=startDate;
        this.#endDate=endDate;
        this.#IncomeList=IncomeList;
        this.#ExpenseList=ExpenseList;
        this.#SavingsList=SavingsList;  
        this.#LoansList=Loanslist;
        this.#bankname=bankName; 
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
    #startDate= new Date();
    #endDate= new Date();
    #IncomeList=[];
    #ExpenseList=[];
    #SavingsList=[];
    #LoansList=[];
    #bankname;
    constructor(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        this.#reportID=reportID;
        this.#startDate=startDate;
        this.#endDate=endDate;
        this.#IncomeList=IncomeList;
        this.#ExpenseList=ExpenseList; 
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
    #startDate= new Date();
    #endDate= new Date();
    #IncomeList=[];
    #ExpenseList=[];
    #SavingsList=[];
    #LoansList=[];
    #bankname;
    constructor(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        this.#reportID=reportID;
        this.#startDate=startDate;
        this.#endDate=endDate;
        this.#SavingsList=SavingsList;  
        this.#LoansList=Loanslist;
        this.#bankname=bankName;   
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
    FactoryType(){}
    GenerateReport(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        let report= this.FactoryType(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName);
        return report;
    }
}

class OverallReportFactory extends ReportFactory
{
    FactoryType(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        let report= new OverallReport(reportID,startDate,endDate,IncomeList,
                        ExpenseList,SavingsList,Loanslist,bankName);
        return report;
    }
}

class CashFlowReportFactory extends ReportFactory
{
    FactoryType(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        let report= new CashFlowReport(reportID,startDate,endDate,IncomeList,
                        ExpenseList,SavingsList,Loanslist,bankName);
        return report;
    }
}

class BankReportFactory extends ReportFactory
{
    FactoryType(reportID,startDate,endDate,IncomeList,ExpenseList,SavingsList,Loanslist,bankName)
    {
        let report= new BankReport(reportID,startDate,endDate,IncomeList,
                        ExpenseList,SavingsList,Loanslist,bankName);
        return report;
    }
}
