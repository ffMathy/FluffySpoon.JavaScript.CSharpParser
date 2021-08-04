using System;

namespace MyNamespace
{
	[SomeAttribute]
	[SomeAttributeWithParameters(MyName = "Foo", 28, Framework.Blah, typeof(BlahBlah))]
    abstract class MyPoco<WithGenerics> where WithGenerics : new()
	{
		public string[] Name { get; set; }

		public bool @EscapedName { get; set; }

		public int? someField;

		public List<string> someField2 = new List<string>();

        public MyPoco()
		{

		}
	}
}