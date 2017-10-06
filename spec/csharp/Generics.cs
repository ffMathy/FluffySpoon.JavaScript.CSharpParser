using System;

class MyPoco
{
	public SomeFoo<SomeBar, SomeThing> Name { get; set; }
	public SomeFoo<SomeBar<AndStuff>, SomeThing<WithDepth>> Foo { get; set; }
}