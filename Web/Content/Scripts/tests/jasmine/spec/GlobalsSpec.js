describe("Globals", function () {

    //javascript being tested uses alerts which break the unit tests -- this disables them
    beforeEach(function () {
        window.alert = function (str) {

        }
    });

    describe("the FormatDate function", function () {
        it("should be able to convert /Date(1340323200000-0500)/", function () {
            var dateStr = Globals.FormatDate('/Date(1340323200000-0500)/');
            expect(dateStr).toBe('6/21/2012');
        });

        it("should be able to convert /Date(1340402400000)/", function () {
            var dateStr = Globals.FormatDate('/Date(1340402400000)/');
            expect(dateStr).toBe('6/22/2012');
        });

        it("should be able to convert '1/15/10'", function () {
            var dateStr = Globals.FormatDate('1/15/10');
            expect(dateStr).toBe('1/15/2010');
        });
    });

    describe("the FormatTime function", function () {
        it("should be able to convert /Date(1340323200000-0500)/", function () {
            var dateStr = Globals.FormatTime('/Date(1340323200000-0500)/');
            expect(dateStr).toBe('7:00 PM');
        });

        it("should be able to convert /Date(1340402400000)/", function () {
            var dateStr = Globals.FormatTime('/Date(1340402400000)/');
            expect(dateStr).toBe('5:00 PM');
        });

        it("should be able to convert 19:30:00", function () {
            var dateStr = Globals.FormatTime('19:30:00');
            expect(dateStr).toBe('7:30 PM');
        });

        it("should be able to convert 11:45:00", function () {
            var dateStr = Globals.FormatTime('11:45:00');
            expect(dateStr).toBe('11:45 AM');
        });
    });

    describe("the TestInput function", function () {
        it("should return true for a 5 digit zipcode", function () {
            $('[id$=Location]').val('55555');
            $('[id$=Restaurant]').val('');
            var returnval = Globals.TestInput();
            expect(returnval).toBe(true);
        });
        it("should return false for both inputs being blank", function () {
            $('[id$=Location]').val('');
            $('[id$=Restaurant]').val('');
            var returnval = Globals.TestInput();
            expect(returnval).toBe(false);
        });
        it("should return false if not 5 digits", function () {
            $('[id$=Location]').val('4444');
            $('[id$=Restaurant]').val('');
            var returnval = Globals.TestInput();
            expect(returnval).toBe(false);
        });
        it("should return false if not all inputs are digits", function () {
            $('[id$=Location]').val('555a5');
            $('[id$=Restaurant]').val('');
            var returnval = Globals.TestInput();
            expect(returnval).toBe(false);
        });
    });

    describe("the getDateFromDotNetString function", function () {
        it("should be able to convert /Date(1340323200000-0500)/", function () {
            var returnval = Globals.privates.getDateFromDotNetString('/Date(1340323200000-0500)/');
            expect(returnval.toLocaleString()).toBe('Thu Jun 21 2012 19:00:00 GMT-0500 (Central Daylight Time)');
        });
        it("should be able to convert /Date(1340402400000)/", function () {
            var returnval = Globals.privates.getDateFromDotNetString('/Date(1340402400000)/');
            expect(returnval.toLocaleString()).toBe('Fri Jun 22 2012 17:00:00 GMT-0500 (Central Daylight Time)');
        });
    });


    describe("the getDate function", function () {
        it("should be able to convert /Date(1340323200000-0500)/", function () {
            var returnval = Globals.privates.getDate('/Date(1340323200000-0500)/');
            expect(returnval.toLocaleString()).toBe('Thu Jun 21 2012 19:00:00 GMT-0500 (Central Daylight Time)');
        });
        it("should be able to convert /Date(1340402400000)/", function () {
            var returnval = Globals.privates.getDate('/Date(1340402400000)/');
            expect(returnval.toLocaleString()).toBe('Fri Jun 22 2012 17:00:00 GMT-0500 (Central Daylight Time)');
        });
        it("should be able to convert '1/15/10'", function () {
            var returnval = Globals.privates.getDate('1/15/10');
            expect(returnval.toLocaleString()).toBe('Fri Jan 15 2010 00:00:00 GMT-0600 (Central Standard Time)');
        });
    });

    describe("the search restaurants", function () {
        it("should be able to filter results by City", function () {
            var restaurantObj1 = { City: "Solitude", Cuisine: "Italian", Price: 3, Id: 1, IsAcceptingReservations: true };
            var restaurantObj2 = { City: "WhiteRun", Cuisine: "Polish", Price: 2, Id: 2, IsAcceptingReservations: false };
            var restaurantObj3 = { City: "Windhelm", Cuisine: "American", Price: 1, Id: 3, IsAcceptingReservations: true };
            var obj1 = { Restaurant: restaurantObj1 };
            var obj2 = { Restaurant: restaurantObj2 };
            var obj3 = { Restaurant: restaurantObj3 };
            var restaurantArray = new Array();
            var filterArray = new Array();
            var resultsArray = {};
            restaurantArray[0] = obj1;
            restaurantArray[1] = obj2;
            restaurantArray[2] = obj3;
            filterArray["City"] = new Array();
            filterArray["City"].push("Solitude");
            FilterResults.Filter(resultsArray, restaurantArray, filterArray);
            expect(resultsArray[obj1.Restaurant.Id]).toBe(1);
            expect(resultsArray[obj2.Restaurant.Id]).toBe(0);
            expect(resultsArray[obj3.Restaurant.Id]).toBe(0);
        });

        it("should be able to filter results by Cuisine", function () {
            var restaurantObj1 = { City: "Solitude", Cuisine: "Italian", Price: 3, Id: 1, IsAcceptingReservations: true };
            var restaurantObj2 = { City: "WhiteRun", Cuisine: "Polish", Price: 2, Id: 2, IsAcceptingReservations: false };
            var restaurantObj3 = { City: "Windhelm", Cuisine: "American", Price: 1, Id: 3, IsAcceptingReservations: true };
            var obj1 = { Restaurant: restaurantObj1 };
            var obj2 = { Restaurant: restaurantObj2 };
            var obj3 = { Restaurant: restaurantObj3 };
            var restaurantArray = new Array();
            var filterArray = new Array();
            var resultsArray = {};
            restaurantArray[0] = obj1;
            restaurantArray[1] = obj2;
            restaurantArray[2] = obj3;
            filterArray["Cuisine"] = new Array();
            filterArray["Cuisine"].push("American");
            FilterResults.Filter(resultsArray, restaurantArray, filterArray);
            expect(resultsArray[obj1.Restaurant.Id]).toBe(0);
            expect(resultsArray[obj2.Restaurant.Id]).toBe(0);
            expect(resultsArray[obj3.Restaurant.Id]).toBe(1);
        });

        it("should be able to filter results by Price", function () {
            var restaurantObj1 = { City: "Solitude", Cuisine: "Italian", Price: 3, Id: 1, IsAcceptingReservations: true };
            var restaurantObj2 = { City: "WhiteRun", Cuisine: "Polish", Price: 2, Id: 2, IsAcceptingReservations: false };
            var restaurantObj3 = { City: "Windhelm", Cuisine: "American", Price: 1, Id: 3, IsAcceptingReservations: true };
            var obj1 = { Restaurant: restaurantObj1 };
            var obj2 = { Restaurant: restaurantObj2 };
            var obj3 = { Restaurant: restaurantObj3 };
            var restaurantArray = new Array();
            var filterArray = new Array();
            var resultsArray = {};
            restaurantArray[0] = obj1;
            restaurantArray[1] = obj2;
            restaurantArray[2] = obj3;
            filterArray["Price"] = new Array();
            filterArray["Price"].push("1");
            filterArray["Price"].push("2");
            FilterResults.Filter(resultsArray, restaurantArray, filterArray);
            expect(resultsArray[obj1.Restaurant.Id]).toBe(0);
            expect(resultsArray[obj2.Restaurant.Id]).toBe(1);
            expect(resultsArray[obj3.Restaurant.Id]).toBe(1);
        });

        it("should be able to filter results by Avaliability", function () {
            var restaurantObj1 = { City: "Solitude", Cuisine: "Italian", Price: 3, Id: 1, IsAcceptingReservations: true };
            var restaurantObj2 = { City: "WhiteRun", Cuisine: "Polish", Price: 2, Id: 2, IsAcceptingReservations: false };
            var restaurantObj3 = { City: "Windhelm", Cuisine: "American", Price: 1, Id: 3, IsAcceptingReservations: true };
            var obj1 = { Restaurant: restaurantObj1 };
            var obj2 = { Restaurant: restaurantObj2 };
            var obj3 = { Restaurant: restaurantObj3 };
            var restaurantArray = new Array();
            var filterArray = new Array();
            var resultsArray = {};
            restaurantArray[0] = obj1;
            restaurantArray[1] = obj2;
            restaurantArray[2] = obj3;
            filterArray["IsAcceptingReservations"] = new Array();
            filterArray["IsAcceptingReservations"].push(true);
            FilterResults.Filter(resultsArray, restaurantArray, filterArray);
            expect(resultsArray[obj1.Restaurant.Id]).toBe(1);
            expect(resultsArray[obj2.Restaurant.Id]).toBe(0);
            expect(resultsArray[obj3.Restaurant.Id]).toBe(1);
        });

        it("should be able to sort filter results by multiple filters", function () {
            var restaurantObj1 = { City: "Solitude", Cuisine: "Italian", Price: 3, Id: 1, IsAcceptingReservations: true };
            var restaurantObj2 = { City: "WhiteRun", Cuisine: "Polish", Price: 2, Id: 2, IsAcceptingReservations: false };
            var restaurantObj3 = { City: "Windhelm", Cuisine: "American", Price: 1, Id: 3, IsAcceptingReservations: true };
            var obj1 = { Restaurant: restaurantObj1 };
            var obj2 = { Restaurant: restaurantObj2 };
            var obj3 = { Restaurant: restaurantObj3 };
            var restaurantArray = new Array();
            var filterArray = new Array();
            var resultsArray = {};
            restaurantArray[0] = obj1;
            restaurantArray[1] = obj2;
            restaurantArray[2] = obj3;
            filterArray["City"] = new Array();
            filterArray["City"].push("Solitude");
            filterArray["IsAcceptingReservations"] = new Array();
            filterArray["IsAcceptingReservations"].push(true);
            FilterResults.Filter(resultsArray, restaurantArray, filterArray);
            expect(resultsArray[obj1.Restaurant.Id]).toBe(1);
            expect(resultsArray[obj2.Restaurant.Id]).toBe(0);
            expect(resultsArray[obj3.Restaurant.Id]).toBe(0);
        });
    });

    describe("the RoundNumbers function", function () {
        it("should be able to round 5.996868867723", function () {
            var returnval = Globals.RoundNumber(5.996868867723, 3);
            expect(returnval).toBe(5.997);
        });
        it("should be able to round 5.999868867723", function () {
            var returnval = Globals.RoundNumber(5.999868867723, 3);
            expect(returnval).toBe(6.000);
        });
        it("should be able to round 0.99423411", function () {
            var returnval = Globals.RoundNumber(0.99423411, 6);
            expect(returnval).toBe(0.994234);
        });
    });
});