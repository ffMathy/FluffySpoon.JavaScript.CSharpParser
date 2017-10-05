using System;

namespace MyNamespace
{
    public abstract class MyPoco<WithGenerics>
	{
		public string[] Name { get; set; }

		public int? someField;

        public MyPoco()
		{

		}
	}
}