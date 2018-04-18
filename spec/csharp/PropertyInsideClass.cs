class Foobar
{
	string MyProperty { get; set; }

	string ReadOnlyProperty
    {
		get
        {
            return "lol";
        }
    }

    [SomeAttribute]
	string GetSetProperty
    {
		get
        {
            return "lol";
        }
		set
        {
			//do stuff
        }
    }

    enum Foobar
    {
        Stuff
    }

	public virtual string MyPublicVirtualProperty { get; set; }

    string ReadOnlyShortProperty => "foobar";

    (string, Func<int, string>) TupleReturningProperty => ("foobar", 1337);
    (string a, Func<int, string> b) NamedTupleReturningProperty => ("foobar", 1337);
}