using System;

namespace MyNamespace
{
    public abstract class MyPoco<WithGenerics> where WithGenerics : new()
	{
		public string[] Name { get; set; }

		public int? someField;

        public MyPoco()
		{

		}
	}
}