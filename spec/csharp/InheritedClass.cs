class MyClass : IMyInterface1<Foo>, IMyInterface2<Foo, Bar> where Foo : class
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