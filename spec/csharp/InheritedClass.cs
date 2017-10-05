class MyClass : IMyInterface<Foo> where Foo : class
{
	void Bar()
	{

	}

	public void Foo()
	{

	}
}

interface IMyInterface
{
	void Foo();
}