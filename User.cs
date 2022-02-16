/*This class was not created by me as I picked up on this project
from the previous team member; included for reference purposes.*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class User 
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public bool IsConfirmed { get; set; }
        public LookUp<int> StatusType { get; set; }
        public List<string> Roles { get; set; }
    }
}
