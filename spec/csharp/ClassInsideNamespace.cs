using System;

namespace MyNamespace.Domain
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