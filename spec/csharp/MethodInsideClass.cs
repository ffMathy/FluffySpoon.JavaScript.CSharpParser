class Foobar
{
    string myField;
    bool SomeOtherStuff { get; set; }

	virtual string MyFunction()
    {

    }

    [SomeAttribute]
    void SomeOtherFunction(
        string parameter1, 
        bool parameter2 = false, 
        List<Dictionary<string, int>> foo = "bar",
        params string[] someArray)
    {

    }

	List<Dictionary<string, int>> Stuff() { }
}