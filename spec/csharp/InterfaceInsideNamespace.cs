using System;

namespace MyNamespace.Domain
{
    public interface MyPoco
	{
		string[] Name { get; set; }

		int SomeMethod();
	}
}