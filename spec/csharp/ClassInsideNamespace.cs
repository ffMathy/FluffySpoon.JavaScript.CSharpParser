using System;

namespace MyNamespace
{
	[SomeAttribute]
	[SomeAttributeWithParameters(MyName = "Foo", 28, Framework.Blah)]
    abstract class MyPoco<WithGenerics> where WithGenerics : new()
	{
		public string[] Name { get; set; }

		public int? someField;

		public List<string> someField2 = new List<string>();

        public MyPoco()
		{

		}
	}
}