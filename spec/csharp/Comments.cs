public class Foobar
{
    string myField;
    bool SomeOtherStuff { get; set; }

	virtual /*string*/ void MyFunction()
    {
        //some region that is commented
    }

    void SomeOtherFunction(/*string parameter1, */bool parameter2 = false, List<Dictionary<string, int>> foo = "bar")
    {

    }

    //List<Dictionary<string, int>> Stuff() { }
    List<Dictionary<string, int>> OtherStuff() { }
}