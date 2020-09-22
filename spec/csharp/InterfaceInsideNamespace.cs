using System;

namespace MyNamespace
{
	[SomeAttribute]
    public interface MyPoco
	{
		string[] Name { get; set; }

		bool @EscapedName { get; set; }

		System.Int32 SomeMethod();
	}
}