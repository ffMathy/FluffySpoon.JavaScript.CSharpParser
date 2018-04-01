interface MyInterface : IMyInterface1<Foo>, IMyInterface2<Foo, Bar> where Foo : class
{
	void Bar()
	{

	}

	public void Foo()
	{

	}
}