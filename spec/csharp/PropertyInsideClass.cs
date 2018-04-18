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
}