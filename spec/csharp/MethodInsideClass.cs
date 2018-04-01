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
        [Hello] [Blah] [Foo, Bar] string foo2 = "bar",
        [Blah] params string[] someArray)
    {

    }

    public string MethodWithMultipleParametersAnnotated([Annotation1]string baz, [Annotation2]int buz) { 
    }

	List<Dictionary<string, int>> Stuff() { }
}